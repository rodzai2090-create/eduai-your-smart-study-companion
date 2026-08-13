import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Curriculum data access. Every level of the hierarchy
 * (country → board → class → subject → chapter → topic) is loaded from the
 * database, so administrators can extend the curriculum without code changes.
 */

export type Country = { id: string; name: string; code: string };
export type EducationBoard = {
  id: string;
  country_id: string;
  name: string;
  code: string;
  description: string | null;
};
export type ClassGrade = { id: string; board_id: string; name: string; level: number };
export type Subject = {
  id: string;
  class_id: string;
  name: string;
  code: string;
  description: string | null;
};
export type Chapter = {
  id: string;
  subject_id: string;
  name: string;
  chapter_number: number;
  description: string | null;
};
export type Topic = {
  id: string;
  chapter_id: string;
  name: string;
  topic_number: number;
  description: string | null;
};

const unwrap = <T>(result: { data: T[] | null; error: { message: string } | null }): T[] => {
  if (result.error) throw new Error(result.error.message);
  return result.data ?? [];
};

export const countriesQuery = queryOptions({
  queryKey: ["curriculum", "countries"],
  queryFn: async () =>
    unwrap<Country>(
      await supabase
        .from("countries")
        .select("id, name, code")
        .eq("status", true)
        .order("name"),
    ),
});

export const boardsQuery = (countryId: string | null) =>
  queryOptions({
    queryKey: ["curriculum", "boards", countryId],
    enabled: Boolean(countryId),
    queryFn: async () =>
      unwrap<EducationBoard>(
        await supabase
          .from("education_boards")
          .select("id, country_id, name, code, description")
          .eq("status", true)
          .eq("country_id", countryId!)
          .order("name"),
      ),
  });

export const classesQuery = (boardId: string | null) =>
  queryOptions({
    queryKey: ["curriculum", "classes", boardId],
    enabled: Boolean(boardId),
    queryFn: async () =>
      unwrap<ClassGrade>(
        await supabase
          .from("classes")
          .select("id, board_id, name, level")
          .eq("status", true)
          .eq("board_id", boardId!)
          .order("level"),
      ),
  });

export const subjectsQuery = (classId: string | null) =>
  queryOptions({
    queryKey: ["curriculum", "subjects", classId],
    enabled: Boolean(classId),
    queryFn: async () =>
      unwrap<Subject>(
        await supabase
          .from("subjects")
          .select("id, class_id, name, code, description")
          .eq("status", true)
          .eq("class_id", classId!)
          .order("name"),
      ),
  });

export const chaptersQuery = (subjectId: string | null) =>
  queryOptions({
    queryKey: ["curriculum", "chapters", subjectId],
    enabled: Boolean(subjectId),
    queryFn: async () =>
      unwrap<Chapter>(
        await supabase
          .from("chapters")
          .select("id, subject_id, name, chapter_number, description")
          .eq("status", true)
          .eq("subject_id", subjectId!)
          .order("chapter_number"),
      ),
  });

export const topicsQuery = (chapterId: string | null) =>
  queryOptions({
    queryKey: ["curriculum", "topics", chapterId],
    enabled: Boolean(chapterId),
    queryFn: async () =>
      unwrap<Topic>(
        await supabase
          .from("topics")
          .select("id, chapter_id, name, topic_number, description")
          .eq("status", true)
          .eq("chapter_id", chapterId!)
          .order("topic_number"),
      ),
  });
