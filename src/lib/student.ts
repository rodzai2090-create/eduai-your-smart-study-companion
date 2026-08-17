import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Student profile, curriculum selection and derived learning statistics.
 * Everything here is scoped to the signed-in user by row-level security.
 */

export type StudentProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  country_id: string | null;
  board_id: string | null;
  class_id: string | null;
  onboarded: boolean;
  daily_study_minutes: number;
  preferred_days: string[];
  exam_date: string | null;
};

export type StudentContext = {
  userId: string | null;
  profile: StudentProfile | null;
  subjectIds: string[];
  labels: {
    country: string | null;
    board: string | null;
    className: string | null;
  };
};

const err = (e: { message: string } | null) => {
  if (e) throw new Error(e.message);
};

export async function getUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export const studentQuery = queryOptions({
  queryKey: ["student", "context"],
  queryFn: async (): Promise<StudentContext> => {
    const userId = await getUserId();
    if (!userId) {
      return { userId: null, profile: null, subjectIds: [], labels: { country: null, board: null, className: null } };
    }

    const profileRes = await supabase
      .from("profiles")
      .select(
        "id, full_name, email, country_id, board_id, class_id, onboarded, daily_study_minutes, preferred_days, exam_date",
      )
      .eq("id", userId)
      .maybeSingle();
    err(profileRes.error);
    const profile = (profileRes.data as StudentProfile | null) ?? null;

    const subjectsRes = await supabase.from("student_subjects").select("subject_id").eq("user_id", userId);
    err(subjectsRes.error);

    const labels: StudentContext["labels"] = { country: null, board: null, className: null };
    if (profile?.country_id) {
      const r = await supabase.from("countries").select("name").eq("id", profile.country_id).maybeSingle();
      labels.country = r.data?.name ?? null;
    }
    if (profile?.board_id) {
      const r = await supabase.from("education_boards").select("code, name").eq("id", profile.board_id).maybeSingle();
      labels.board = r.data ? `${r.data.code}` : null;
    }
    if (profile?.class_id) {
      const r = await supabase.from("classes").select("name").eq("id", profile.class_id).maybeSingle();
      labels.className = r.data?.name ?? null;
    }

    return {
      userId,
      profile,
      subjectIds: (subjectsRes.data ?? []).map((r) => r.subject_id),
      labels,
    };
  },
});

export const studentSubjectsQuery = (subjectIds: string[]) =>
  queryOptions({
    queryKey: ["student", "subjects", subjectIds.slice().sort()],
    enabled: subjectIds.length > 0,
    queryFn: async () => {
      const res = await supabase.from("subjects").select("id, name, code, class_id").in("id", subjectIds).order("name");
      err(res.error);
      return res.data ?? [];
    },
  });

export async function saveCurriculumSelection(input: {
  userId: string;
  countryId: string;
  boardId: string;
  classId: string;
  subjectIds: string[];
  fullName?: string | null;
}) {
  const upsert = await supabase.from("profiles").upsert(
    {
      id: input.userId,
      country_id: input.countryId,
      board_id: input.boardId,
      class_id: input.classId,
      onboarded: true,
      ...(input.fullName ? { full_name: input.fullName } : {}),
    },
    { onConflict: "id" },
  );
  err(upsert.error);

  const del = await supabase.from("student_subjects").delete().eq("user_id", input.userId);
  err(del.error);

  if (input.subjectIds.length > 0) {
    const ins = await supabase
      .from("student_subjects")
      .insert(input.subjectIds.map((subject_id) => ({ user_id: input.userId, subject_id })));
    err(ins.error);
  }
}

export async function updateProfile(userId: string, patch: Partial<StudentProfile>) {
  const res = await supabase.from("profiles").update(patch).eq("id", userId);
  err(res.error);
}

export async function logActivity(input: {
  userId: string;
  activityType: string;
  minutes?: number;
  topicId?: string | null;
}) {
  await supabase.from("activity_log").insert({
    user_id: input.userId,
    activity_type: input.activityType,
    minutes: input.minutes ?? 0,
    topic_id: input.topicId ?? null,
  });
}
