import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  entityByKey,
  listRows,
  saveRow,
  setRowStatus,
  type EntityConfig,
  type EntityKey,
  type Row,
} from "@/lib/curriculum-admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/** Ordered ancestors of an entity, outermost first. */
function ancestorsOf(config: EntityConfig): EntityConfig[] {
  const chain: EntityConfig[] = [];
  let current = config;
  while (current.parent) {
    current = entityByKey(current.parent.key);
    chain.unshift(current);
  }
  return chain;
}

function ParentSelect({
  config,
  parentId,
  value,
  onChange,
}: {
  config: EntityConfig;
  parentId: string | null;
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  const rows = useRows(config, parentId);
  return (
    <div className="grid gap-1.5">
      <Label className="text-xs text-muted-foreground">{config.singular}</Label>
      <Select value={value ?? ""} onValueChange={(v) => onChange(v || null)}>
        <SelectTrigger className="h-9 w-full sm:w-[200px]">
          <SelectValue placeholder={`Select ${config.singular.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {(rows.data ?? []).map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
              {r.status ? "" : " (inactive)"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function useRows(config: EntityConfig, parentId: string | null) {
  return useQuery({
    queryKey: ["admin", config.key, parentId],
    queryFn: () => listRows(config, parentId),
    enabled: !config.parent || Boolean(parentId),
  });
}

export function EntityManager({
  config,
  selected,
  onSelect,
}: {
  config: EntityConfig;
  selected: Partial<Record<EntityKey, string | null>>;
  onSelect: (key: EntityKey, id: string | null) => void;
}) {
  const queryClient = useQueryClient();
  const ancestors = useMemo(() => ancestorsOf(config), [config]);
  const parentId = config.parent ? (selected[config.parent.key] ?? null) : null;
  const rows = useRows(config, parentId);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["admin", config.key] });

  const save = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {};
      for (const field of config.fields) {
        const raw = values[field.name] ?? "";
        payload[field.name] =
          field.type === "number" ? (raw === "" ? null : Number(raw)) : raw === "" ? null : raw;
      }
      if (config.parent) payload[config.parent.column] = parentId;
      await saveRow(config, payload, editing?.id);
    },
    onSuccess: () => {
      toast.success(editing ? `${config.singular} updated` : `${config.singular} added`);
      setOpen(false);
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) => setRowStatus(config, id, status),
    onSuccess: () => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["curriculum"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const openForm = (row: Row | null) => {
    setEditing(row);
    const next: Record<string, string> = {};
    for (const field of config.fields) {
      const v = row?.[field.name];
      next[field.name] = v === null || v === undefined ? "" : String(v);
    }
    setValues(next);
    setOpen(true);
  };

  return (
    <div className="grid gap-4">
      {ancestors.length > 0 && (
        <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-muted/30 p-3">
          {ancestors.map((ancestor) => (
            <ParentSelect
              key={ancestor.key}
              config={ancestor}
              parentId={ancestor.parent ? (selected[ancestor.parent.key] ?? null) : null}
              value={selected[ancestor.key] ?? null}
              onChange={(id) => onSelect(ancestor.key, id)}
            />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {config.parent && !parentId
            ? `Choose a ${config.parent.label.toLowerCase()} to manage ${config.label.toLowerCase()}.`
            : `${rows.data?.length ?? 0} ${config.label.toLowerCase()}`}
        </p>
        <Button size="sm" onClick={() => openForm(null)} disabled={Boolean(config.parent) && !parentId}>
          <Plus className="mr-1 h-4 w-4" /> Add {config.singular.toLowerCase()}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              {config.fields.map((f) => (
                <TableHead key={f.name}>{f.label}</TableHead>
              ))}
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Edit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.isLoading && (
              <TableRow>
                <TableCell colSpan={config.fields.length + 2} className="py-8 text-center">
                  <Loader2 className="mx-auto h-4 w-4 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}
            {!rows.isLoading && (rows.data?.length ?? 0) === 0 && (
              <TableRow>
                <TableCell
                  colSpan={config.fields.length + 2}
                  className="py-8 text-center text-sm text-muted-foreground"
                >
                  Nothing here yet.
                </TableCell>
              </TableRow>
            )}
            {(rows.data ?? []).map((row) => (
              <TableRow key={row.id}>
                {config.fields.map((f) => (
                  <TableCell key={f.name} className={f.name === "name" ? "font-medium" : ""}>
                    {row[f.name] === null || row[f.name] === undefined ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      String(row[f.name])
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={row.status}
                      onCheckedChange={(status) => toggle.mutate({ id: row.id, status })}
                      aria-label={`Toggle ${row.name}`}
                    />
                    <Badge variant={row.status ? "secondary" : "outline"}>
                      {row.status ? "Active" : "Hidden"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => openForm(row)} aria-label="Edit">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${config.singular.toLowerCase()}` : `New ${config.singular.toLowerCase()}`}
            </DialogTitle>
            <DialogDescription>
              Changes apply immediately to what students can browse.
            </DialogDescription>
          </DialogHeader>
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate();
            }}
          >
            {config.fields.map((field) => (
              <div key={field.name} className="grid gap-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    id={field.name}
                    value={values[field.name] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  />
                ) : (
                  <Input
                    id={field.name}
                    type={field.type === "number" ? "number" : "text"}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={values[field.name] ?? ""}
                    onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                  />
                )}
              </div>
            ))}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
