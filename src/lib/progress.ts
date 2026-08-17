import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Real progress metrics. Everything here is derived from the student's own
 * recorded activity — no static demo percentages.
 */

export type SubjectProgress = {
  subjectId: string;
  subjectName: string;
  totalTopics: number;
  completedTopics: number;
  percent: number;
};

export type WeakTopic = {
  topicId: string;
  topicName: string;
  subjectName: string;
  attempts: number;
  accuracy: number;
};

export type ProgressSummary = {
  totalTopics: number;
  completedTopics: number;
  overallPercent: number;
  bySubject: SubjectProgress[];
  quizAccuracy: number | null;
  practiceAccuracy: number | null;
  lessonsCompleted: number;
  flashcardsKnown: number;
  studyMinutes: number;
  streakDays: number;
  weakTopics: WeakTopic[];
  preparationScore: number;
  nextTopic: { id: string; name: string; subjectName: string } | null;
};

const err = (e: { message: string } | null) => {
  if (e) throw new Error(e.message);
};

function streakFromDates(dates: string[]): number {
  const days = new Set(dates.map((d) => new Date(d).toISOString().slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  // Allow the streak to start yesterday if today has no activity yet.
  if (!days.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export const progressQuery = (userId: string | null, subjectIds: string[]) =>
  queryOptions({
    queryKey: ["progress", userId, subjectIds.slice().sort()],
    enabled: Boolean(userId),
    queryFn: async (): Promise<ProgressSummary> => {
      const empty: ProgressSummary = {
        totalTopics: 0,
        completedTopics: 0,
        overallPercent: 0,
        bySubject: [],
        quizAccuracy: null,
        practiceAccuracy: null,
        lessonsCompleted: 0,
        flashcardsKnown: 0,
        studyMinutes: 0,
        streakDays: 0,
        weakTopics: [],
        preparationScore: 0,
        nextTopic: null,
      };
      if (!userId) return empty;

      const subjectsRes = subjectIds.length
        ? await supabase.from("subjects").select("id, name").in("id", subjectIds)
        : { data: [], error: null };
      err(subjectsRes.error as { message: string } | null);
      const subjectNames = new Map((subjectsRes.data ?? []).map((s) => [s.id, s.name]));

      const topicsRes = subjectIds.length
        ? await supabase
            .from("topics")
            .select("id, name, topic_number, chapter_id, chapters!inner(id, subject_id, chapter_number)")
            .eq("status", true)
            .in("chapters.subject_id", subjectIds)
        : { data: [], error: null };
      err(topicsRes.error as { message: string } | null);

      type TopicRow = {
        id: string;
        name: string;
        topic_number: number;
        chapters: { subject_id: string; chapter_number: number } | { subject_id: string; chapter_number: number }[];
      };
      const topics = ((topicsRes.data ?? []) as unknown as TopicRow[]).map((t) => {
        const ch = Array.isArray(t.chapters) ? t.chapters[0]! : t.chapters;
        return { id: t.id, name: t.name, topicNumber: t.topic_number, subjectId: ch.subject_id, chapterNumber: ch.chapter_number };
      });

      const [progressRes, attemptsRes, quizRes, cardsRes, activityRes] = await Promise.all([
        supabase.from("topic_progress").select("topic_id, lesson_completed, notes_completed").eq("user_id", userId),
        supabase.from("question_attempts").select("topic_id, is_correct").eq("user_id", userId),
        supabase.from("quiz_attempts").select("total_questions, correct_answers").eq("user_id", userId),
        supabase.from("flashcard_reviews").select("state").eq("user_id", userId).eq("state", "known"),
        supabase.from("activity_log").select("minutes, created_at").eq("user_id", userId),
      ]);
      err(progressRes.error);
      err(attemptsRes.error);
      err(quizRes.error);
      err(cardsRes.error);
      err(activityRes.error);

      const completed = new Set(
        (progressRes.data ?? []).filter((r) => r.lesson_completed).map((r) => r.topic_id),
      );

      const bySubject: SubjectProgress[] = subjectIds.map((id) => {
        const subjectTopics = topics.filter((t) => t.subjectId === id);
        const done = subjectTopics.filter((t) => completed.has(t.id)).length;
        return {
          subjectId: id,
          subjectName: subjectNames.get(id) ?? "Subject",
          totalTopics: subjectTopics.length,
          completedTopics: done,
          percent: subjectTopics.length ? Math.round((done / subjectTopics.length) * 100) : 0,
        };
      });

      const attempts = attemptsRes.data ?? [];
      const practiceAccuracy = attempts.length
        ? Math.round((attempts.filter((a) => a.is_correct).length / attempts.length) * 100)
        : null;

      const quizzes = quizRes.data ?? [];
      const quizTotal = quizzes.reduce((n, q) => n + q.total_questions, 0);
      const quizCorrect = quizzes.reduce((n, q) => n + q.correct_answers, 0);
      const quizAccuracy = quizTotal ? Math.round((quizCorrect / quizTotal) * 100) : null;

      const perTopic = new Map<string, { total: number; correct: number }>();
      for (const a of attempts) {
        const cur = perTopic.get(a.topic_id) ?? { total: 0, correct: 0 };
        cur.total += 1;
        if (a.is_correct) cur.correct += 1;
        perTopic.set(a.topic_id, cur);
      }
      const weakTopics: WeakTopic[] = [...perTopic.entries()]
        .map(([topicId, s]) => {
          const t = topics.find((x) => x.id === topicId);
          return {
            topicId,
            topicName: t?.name ?? "Topic",
            subjectName: t ? (subjectNames.get(t.subjectId) ?? "Subject") : "Subject",
            attempts: s.total,
            accuracy: Math.round((s.correct / s.total) * 100),
          };
        })
        .filter((t) => t.accuracy < 70)
        .sort((a, b) => a.accuracy - b.accuracy)
        .slice(0, 6);

      const studyMinutes = (activityRes.data ?? []).reduce((n, a) => n + a.minutes, 0);
      const streakDays = streakFromDates((activityRes.data ?? []).map((a) => a.created_at));

      const totalTopics = topics.length;
      const completedTopics = topics.filter((t) => completed.has(t.id)).length;
      const overallPercent = totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0;

      // Transparent preparation score: coverage 50%, quiz 25%, practice 15%, revision 10%.
      const revisionSignal = Math.min(100, (cardsRes.data ?? []).length * 5);
      const preparationScore = Math.round(
        overallPercent * 0.5 + (quizAccuracy ?? 0) * 0.25 + (practiceAccuracy ?? 0) * 0.15 + revisionSignal * 0.1,
      );

      const next = topics
        .slice()
        .sort((a, b) => a.chapterNumber - b.chapterNumber || a.topicNumber - b.topicNumber)
        .find((t) => !completed.has(t.id));

      return {
        totalTopics,
        completedTopics,
        overallPercent,
        bySubject,
        quizAccuracy,
        practiceAccuracy,
        lessonsCompleted: completed.size,
        flashcardsKnown: (cardsRes.data ?? []).length,
        studyMinutes,
        streakDays,
        weakTopics,
        preparationScore,
        nextTopic: next
          ? { id: next.id, name: next.name, subjectName: subjectNames.get(next.subjectId) ?? "Subject" }
          : null,
      };
    },
  });
