import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/** Topic-level learning content: lessons, videos, questions and flashcards. */

export type Lesson = {
  id: string;
  topic_id: string;
  title: string;
  explanation: string | null;
  key_concepts: string[];
  formulas: string[];
  examples: string | null;
  summary: string | null;
  notes: string | null;
  is_demo: boolean;
};

export type Video = {
  id: string;
  title: string;
  description: string | null;
  url: string;
  source_label: string | null;
  duration_seconds: number | null;
  transcript: string | null;
};

export type Difficulty = "easy" | "medium" | "hard";
export type QuestionType = "mcq" | "short" | "long" | "conceptual" | "numerical";

export type Question = {
  id: string;
  topic_id: string;
  type: QuestionType;
  difficulty: Difficulty;
  prompt: string;
  options: string[];
  correct_answer: string | null;
  explanation: string | null;
  is_demo: boolean;
};

export type Flashcard = {
  id: string;
  topic_id: string;
  front: string;
  back: string;
  is_demo: boolean;
};

const err = (e: { message: string } | null) => {
  if (e) throw new Error(e.message);
};

export const lessonQuery = (topicId: string | null) =>
  queryOptions({
    queryKey: ["learning", "lesson", topicId],
    enabled: Boolean(topicId),
    queryFn: async (): Promise<Lesson | null> => {
      const res = await supabase
        .from("lessons")
        .select("id, topic_id, title, explanation, key_concepts, formulas, examples, summary, notes, is_demo")
        .eq("topic_id", topicId!)
        .eq("status", true)
        .maybeSingle();
      err(res.error);
      return (res.data as Lesson | null) ?? null;
    },
  });

export const videosQuery = (topicId: string | null) =>
  queryOptions({
    queryKey: ["learning", "videos", topicId],
    enabled: Boolean(topicId),
    queryFn: async (): Promise<Video[]> => {
      const res = await supabase
        .from("videos")
        .select("id, title, description, url, source_label, duration_seconds, transcript")
        .eq("topic_id", topicId!)
        .eq("status", true);
      err(res.error);
      return (res.data as Video[]) ?? [];
    },
  });

export const questionsQuery = (
  topicId: string | null,
  filters?: { difficulty?: Difficulty | "all"; type?: QuestionType | "all" },
) =>
  queryOptions({
    queryKey: ["learning", "questions", topicId, filters?.difficulty ?? "all", filters?.type ?? "all"],
    enabled: Boolean(topicId),
    queryFn: async (): Promise<Question[]> => {
      let q = supabase
        .from("questions")
        .select("id, topic_id, type, difficulty, prompt, options, correct_answer, explanation, is_demo")
        .eq("topic_id", topicId!)
        .eq("status", true);
      if (filters?.difficulty && filters.difficulty !== "all") q = q.eq("difficulty", filters.difficulty);
      if (filters?.type && filters.type !== "all") q = q.eq("type", filters.type);
      const res = await q;
      err(res.error);
      return ((res.data ?? []) as unknown[]).map((row) => {
        const r = row as Question & { options: unknown };
        return { ...r, options: Array.isArray(r.options) ? (r.options as string[]) : [] };
      });
    },
  });

export const flashcardsQuery = (topicId: string | null) =>
  queryOptions({
    queryKey: ["learning", "flashcards", topicId],
    enabled: Boolean(topicId),
    queryFn: async (): Promise<Flashcard[]> => {
      const res = await supabase
        .from("flashcards")
        .select("id, topic_id, front, back, is_demo")
        .eq("topic_id", topicId!)
        .eq("status", true);
      err(res.error);
      return (res.data as Flashcard[]) ?? [];
    },
  });

/* ---------------- student activity writes ---------------- */

export async function markTopicProgress(
  userId: string,
  topicId: string,
  patch: { lesson_completed?: boolean; notes_completed?: boolean; study_seconds?: number },
) {
  const res = await supabase
    .from("topic_progress")
    .upsert({ user_id: userId, topic_id: topicId, last_viewed_at: new Date().toISOString(), ...patch }, {
      onConflict: "user_id,topic_id",
    });
  err(res.error);
}

export async function recordQuestionAttempts(
  userId: string,
  rows: { questionId: string; topicId: string; isCorrect: boolean; answer: string; seconds: number }[],
) {
  if (rows.length === 0) return;
  const res = await supabase.from("question_attempts").insert(
    rows.map((r) => ({
      user_id: userId,
      question_id: r.questionId,
      topic_id: r.topicId,
      is_correct: r.isCorrect,
      given_answer: r.answer,
      time_seconds: r.seconds,
    })),
  );
  err(res.error);
}

export async function recordQuizAttempt(input: {
  userId: string;
  scopeType: string;
  scopeId: string | null;
  subjectId: string | null;
  total: number;
  correct: number;
  durationSeconds: number;
  details: unknown;
}) {
  const res = await supabase.from("quiz_attempts").insert({
    user_id: input.userId,
    scope_type: input.scopeType,
    scope_id: input.scopeId,
    subject_id: input.subjectId,
    total_questions: input.total,
    correct_answers: input.correct,
    score_percent: input.total ? Math.round((input.correct / input.total) * 10000) / 100 : 0,
    duration_seconds: input.durationSeconds,
    details: input.details as never,
  });
  err(res.error);
}

export async function reviewFlashcard(userId: string, flashcardId: string, known: boolean) {
  const intervalDays = known ? 4 : 1;
  const due = new Date(Date.now() + intervalDays * 86_400_000).toISOString();
  const res = await supabase.from("flashcard_reviews").upsert(
    {
      user_id: userId,
      flashcard_id: flashcardId,
      state: known ? "known" : "review",
      interval_days: intervalDays,
      due_at: due,
      reviewed_at: new Date().toISOString(),
    },
    { onConflict: "user_id,flashcard_id" },
  );
  err(res.error);
}

export const flashcardReviewsQuery = (userId: string | null) =>
  queryOptions({
    queryKey: ["learning", "flashcard-reviews", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const res = await supabase
        .from("flashcard_reviews")
        .select("flashcard_id, state, due_at")
        .eq("user_id", userId!);
      err(res.error);
      return res.data ?? [];
    },
  });
