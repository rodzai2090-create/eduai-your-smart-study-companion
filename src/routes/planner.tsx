import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Clock, Plus, Target } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Study Planner — Weekly Revision Schedule | EduAI" },
      {
        name: "description",
        content:
          "Plan your week, balance subjects and stay exam-ready with a study planner built around your syllabus and goals.",
      },
      { property: "og:title", content: "Study Planner — EduAI" },
      {
        property: "og:description",
        content: "Build a weekly revision schedule around your syllabus and exam dates.",
      },
    ],
  }),
  component: PlannerPage,
});

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const sessions: Record<string, { subject: string; topic: string; minutes: number }[]> = {
  Mon: [
    { subject: "Mathematics", topic: "Quadratic Equations", minutes: 45 },
    { subject: "Physics", topic: "Laws of Motion", minutes: 40 },
  ],
  Tue: [{ subject: "Chemistry", topic: "Periodic Trends", minutes: 50 }],
  Wed: [
    { subject: "Biology", topic: "Life Processes", minutes: 45 },
    { subject: "English", topic: "Article Writing", minutes: 30 },
  ],
  Thu: [{ subject: "Mathematics", topic: "Trigonometry", minutes: 60 }],
  Fri: [{ subject: "Computer Science", topic: "Loops", minutes: 35 }],
  Sat: [
    { subject: "Revision", topic: "Weekly mixed quiz", minutes: 60 },
    { subject: "Physics", topic: "Light: Refraction", minutes: 40 },
  ],
  Sun: [{ subject: "Revision", topic: "Flashcard sprint", minutes: 30 }],
};

const goals = [
  { label: "Finish Physics Unit 2", progress: 70 },
  { label: "Complete 300 practice questions", progress: 46 },
  { label: "Revise all Maths formulas", progress: 82 },
];

function PlannerPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Study Planner"
        title="Plan a week you can actually finish"
        description="Balance subjects, protect revision time and keep every chapter on schedule before exams."
        actions={
          <Button>
            <Plus /> New session
          </Button>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="surface-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarDays className="h-4 w-4 text-brand" /> This week
            </CardTitle>
            <Badge variant="secondary">7 subjects</Badge>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {days.map((d) => (
                <div key={d} className="rounded-xl border border-border bg-surface p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {d}
                  </p>
                  <div className="mt-2 grid gap-2">
                    {(sessions[d] ?? []).map((s) => (
                      <div key={s.topic} className="rounded-lg bg-card p-2.5 shadow-sm">
                        <p className="truncate text-xs font-semibold">{s.topic}</p>
                        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                          <Clock className="h-3 w-3 shrink-0" /> {s.minutes}m · {s.subject}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid content-start gap-4">
          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Target className="h-4 w-4 text-brand" /> Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {goals.map((g) => (
                <div key={g.label} className="grid gap-2">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="truncate text-sm">{g.label}</p>
                    <span className="text-xs text-muted-foreground">{g.progress}%</span>
                  </div>
                  <Progress value={g.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Exam countdown</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Term exam</span>
                <Badge variant="outline">24 days</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Board exam</span>
                <Badge variant="outline">118 days</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
