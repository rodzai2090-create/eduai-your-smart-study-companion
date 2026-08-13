import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Flame, Target, Timer, ArrowRight, CheckCircle2 } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { chapters, subjects } from "@/lib/catalog";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — EduAI Study Assistant" },
      {
        name: "description",
        content:
          "Your personal EduAI dashboard: today's study plan, syllabus coverage, streaks and recommended next lessons.",
      },
      { property: "og:title", content: "My Dashboard — EduAI" },
      {
        property: "og:description",
        content: "Track today's plan, syllabus coverage and recommended lessons in one place.",
      },
    ],
  }),
  component: DashboardPage,
});

const stats = [
  { label: "Syllabus covered", value: "58%", icon: Target },
  { label: "Study streak", value: "12 days", icon: Flame },
  { label: "Hours this week", value: "9h 20m", icon: Timer },
  { label: "Lessons done", value: "146", icon: BookOpen },
];

const todayPlan = [
  { time: "16:00", task: "Revise Quadratic Equations", subject: "Mathematics", done: true },
  { time: "17:00", task: "Lesson: Laws of Motion (Part 2)", subject: "Physics", done: true },
  { time: "18:30", task: "Practice set — Periodic Trends", subject: "Chemistry", done: false },
  { time: "20:00", task: "Flashcards: Life Processes", subject: "Biology", done: false },
];

function DashboardPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Welcome back"
        title="My Dashboard"
        description="Everything you're learning this week, in one focused view."
        actions={
          <>
            <Button asChild variant="soft">
              <Link to="/planner">Open planner</Link>
            </Button>
            <Button asChild>
              <Link to="/learn">Continue learning</Link>
            </Button>
          </>
        }
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="surface-card">
            <CardContent className="flex items-center gap-4 p-5">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xl font-bold">{s.value}</p>
                <p className="truncate text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="surface-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Continue where you left off</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            {chapters.slice(0, 5).map((ch) => {
              const subject = subjects.find((s) => s.id === ch.subjectId);
              return (
                <div key={ch.id} className="grid gap-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{ch.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {subject?.name} · {ch.topics.length} topics
                      </p>
                    </div>
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/learn">
                        Resume <ArrowRight />
                      </Link>
                    </Button>
                  </div>
                  <Progress value={ch.progress} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="surface-card">
          <CardHeader>
            <CardTitle className="text-base">Today's plan</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {todayPlan.map((item) => (
              <div
                key={item.task}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 rounded-xl border border-border p-3"
              >
                <CheckCircle2
                  className={`mt-0.5 h-4 w-4 shrink-0 ${item.done ? "text-success" : "text-muted-foreground/40"}`}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.task}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.time} · {item.subject}
                  </p>
                </div>
              </div>
            ))}
            <Badge variant="secondary" className="w-fit">
              2 of 4 tasks complete
            </Badge>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
