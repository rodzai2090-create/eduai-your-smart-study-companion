import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, getBoardsForCountry, getGradesForBoard } from "@/lib/catalog";

/**
 * Country → Board → Grade selector. Purely presentational for now, but the
 * shape mirrors the eventual persisted learner context.
 */
export function ContextPicker({ compact = false }: { compact?: boolean }) {
  const [countryId, setCountryId] = useState("in");
  const [boardId, setBoardId] = useState("cbse");
  const [gradeId, setGradeId] = useState("g10");

  const boardOptions = useMemo(() => getBoardsForCountry(countryId), [countryId]);
  const gradeOptions = useMemo(() => getGradesForBoard(boardId), [boardId]);

  const size = compact ? "h-9 w-[120px] text-xs" : "h-10 w-full text-sm";

  return (
    <div className={compact ? "flex items-center gap-2" : "grid gap-3 sm:grid-cols-3"}>
      <Select
        value={countryId}
        onValueChange={(v) => {
          setCountryId(v);
          const next = getBoardsForCountry(v)[0];
          if (next) {
            setBoardId(next.id);
            setGradeId(getGradesForBoard(next.id)[0]?.id ?? "");
          }
        }}
      >
        <SelectTrigger className={size} aria-label="Country">
          <SelectValue placeholder="Country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.flag} {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={boardId}
        onValueChange={(v) => {
          setBoardId(v);
          setGradeId(getGradesForBoard(v)[0]?.id ?? "");
        }}
      >
        <SelectTrigger className={size} aria-label="Board or curriculum">
          <SelectValue placeholder="Board" />
        </SelectTrigger>
        <SelectContent>
          {boardOptions.map((b) => (
            <SelectItem key={b.id} value={b.id}>
              {b.shortName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={gradeId} onValueChange={setGradeId}>
        <SelectTrigger className={size} aria-label="Grade or class">
          <SelectValue placeholder="Class" />
        </SelectTrigger>
        <SelectContent>
          {gradeOptions.map((g) => (
            <SelectItem key={g.id} value={g.id}>
              {g.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
