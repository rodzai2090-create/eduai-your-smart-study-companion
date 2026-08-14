import { supabase } from "@/integrations/supabase/client";

/**
 * Config-driven admin metadata for the curriculum hierarchy. Adding a new
 * level or field only requires editing this config, never the screens.
 */

export type FieldType = "text" | "number" | "textarea";

export type EntityField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
};

export type EntityKey =
  | "countries"
  | "education_boards"
  | "classes"
  | "subjects"
  | "chapters"
  | "topics";

export type EntityConfig = {
  key: EntityKey;
  label: string;
  singular: string;
  /** Parent entity + foreign key column on this table. */
  parent?: { key: EntityKey; column: string; label: string };
  fields: EntityField[];
  orderBy: string;
};

export const entities: EntityConfig[] = [
  {
    key: "countries",
    label: "Countries",
    singular: "Country",
    orderBy: "name",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Pakistan" },
      { name: "code", label: "Code", type: "text", required: true, placeholder: "PK" },
    ],
  },
  {
    key: "education_boards",
    label: "Boards",
    singular: "Education board",
    orderBy: "name",
    parent: { key: "countries", column: "country_id", label: "Country" },
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        placeholder: "Federal Board of Intermediate and Secondary Education",
      },
      { name: "code", label: "Code", type: "text", required: true, placeholder: "FBISE" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    key: "classes",
    label: "Classes",
    singular: "Class",
    orderBy: "level",
    parent: { key: "education_boards", column: "board_id", label: "Board" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Class 10" },
      { name: "level", label: "Level", type: "number", required: true, placeholder: "10" },
    ],
  },
  {
    key: "subjects",
    label: "Subjects",
    singular: "Subject",
    orderBy: "name",
    parent: { key: "classes", column: "class_id", label: "Class" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Physics" },
      { name: "code", label: "Code", type: "text", required: true, placeholder: "PHY" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    key: "chapters",
    label: "Chapters",
    singular: "Chapter",
    orderBy: "chapter_number",
    parent: { key: "subjects", column: "subject_id", label: "Subject" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Simple Harmonic Motion" },
      { name: "chapter_number", label: "Chapter number", type: "number", required: true, placeholder: "1" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
  {
    key: "topics",
    label: "Topics",
    singular: "Topic",
    orderBy: "topic_number",
    parent: { key: "chapters", column: "chapter_id", label: "Chapter" },
    fields: [
      { name: "name", label: "Name", type: "text", required: true, placeholder: "Hooke's law" },
      { name: "topic_number", label: "Topic number", type: "number", required: true, placeholder: "1" },
      { name: "description", label: "Description", type: "textarea" },
    ],
  },
];

export const entityByKey = (key: EntityKey) => entities.find((e) => e.key === key)!;

export type Row = Record<string, unknown> & { id: string; name: string; status: boolean };

const client = () => supabase as unknown as {
  from: (t: string) => any;
  rpc: (fn: string, args: Record<string, unknown>) => Promise<{ data: unknown; error: unknown }>;
};

export async function listRows(config: EntityConfig, parentId: string | null): Promise<Row[]> {
  let query = client().from(config.key).select("*").order(config.orderBy);
  if (config.parent) {
    if (!parentId) return [];
    query = query.eq(config.parent.column, parentId);
  }
  const { data, error } = await query;
  if (error) throw new Error((error as { message: string }).message);
  return (data ?? []) as Row[];
}

export async function saveRow(
  config: EntityConfig,
  values: Record<string, unknown>,
  id?: string,
): Promise<void> {
  const { error } = id
    ? await client().from(config.key).update(values).eq("id", id)
    : await client().from(config.key).insert(values);
  if (error) throw new Error((error as { message: string }).message);
}

export async function setRowStatus(config: EntityConfig, id: string, status: boolean) {
  const { error } = await client().from(config.key).update({ status }).eq("id", id);
  if (error) throw new Error((error as { message: string }).message);
}

export async function isCurrentUserAdmin(userId: string): Promise<boolean> {
  const { data, error } = await client().rpc("has_role", { _user_id: userId, _role: "admin" });
  if (error) return false;
  return Boolean(data);
}
