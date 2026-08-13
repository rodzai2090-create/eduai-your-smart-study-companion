import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Award, AlertTriangle } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { subjects } from "@/lib/catalog";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress Tracking — Syllabus Coverage | EduAI" },
      {
        name: "description",
        content:
          "See syllabus coverage by subject, quiz accuracy trends, strong areas and weak topics that need revision.",
      },
      { property: "og:title", content: "Progress Tracking — EduAI" },
      {
        property: "og:description",
        content: "Syllabus coverage, accuracy trends, strengths and weak topics at a glance.",
      },
    ],
  }),
  component: ProgressPage,
});

const coverage = [72, 61, 48, 55, 80, 90, 34, 42, 26];
const weekly = [
  { week: "W1", score: 54 },
  { week: "W2", score: 61 },
  { week: "W3", score: 58 },
  { week: "W4", score: 69 },
  { week: "W5", score: 74 },
  { week: "W6", score: 81 },
];

function ProgressPage() {
  const weakTopics = ["Refraction of Light", "Trigonometric Identities", "Chemical Bonding"];
  const strengths = ["Loops & Iteration", "Laws of Motion", "Life Processes"];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Progress"
        title="Know exactly where you stand"
        description="Syllabus coverage, accuracy trends and the topics worth revising next."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-6">
          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-4 w-4 text-brand" /> Quiz accuracy trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-44 items-end gap-3">
                {weekly.map((w) => (
                  <div key={w.week} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg gradient-hero"
                      style={{ height: `${w.score}%` }}
                      aria-label={`${w.week}: ${w.score}%`}
                    />
                    <span className="text-[11px] text-muted-foreground">{w.week}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Syllabus coverage by subject</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {subjects.map((s, i) => (
                <div key={s.id} className="grid gap-2">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="truncate text-sm">{s.name}</p>
                    <span className="text-xs text-muted-foreground">{coverage[i]}%</span>
                  </div>
                  <Progress value={coverage[i]} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Award className="h-4 w-4 text-success" /> Strong areas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {strengths.map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="h-4 w-4 text-highlight" /> Needs revision
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {weakTopics.map((t) => (
                <Badge key={t} variant="outline">
                  {t}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Milestones</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground">
              <p>12-day study streak</p>
              <p>146 lessons completed</p>
              <p>1,280 practice questions answered</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
