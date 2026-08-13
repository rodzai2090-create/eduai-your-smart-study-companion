import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, Layers, FileQuestion, Timer, ArrowRight } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subjects, chapters } from "@/lib/catalog";

export const Route = createFileRoute("/practice")({
  head: () => ({
    meta: [
      { title: "Practice & Quizzes — Exam Preparation | EduAI" },
      {
        name: "description",
        content:
          "Practice questions, chapter quizzes, flashcards and timed mock tests mapped to your board syllabus.",
      },
      { property: "og:title", content: "Practice & Quizzes — EduAI" },
      {
        property: "og:description",
        content: "Quizzes, question banks, flashcards and timed mock tests for exam readiness.",
      },
    ],
  }),
  component: PracticePage,
});

const modes = [
  { icon: ListChecks, title: "Chapter quizzes", desc: "Short quizzes after every chapter." },
  { icon: FileQuestion, title: "Question bank", desc: "Topic-wise practice questions by difficulty." },
  { icon: Layers, title: "Flashcards", desc: "Spaced-repetition decks for fast recall." },
  { icon: Timer, title: "Mock tests", desc: "Full-length timed papers in exam format." },
];

function PracticePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Practice"
        title="Practise until it sticks"
        description="Quizzes, question banks, flashcards and mock tests — all mapped to your chapters and topics."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {modes.map((m) => (
          <Card key={m.title} className="surface-card lift-hover">
            <CardContent className="p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                <m.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-sm font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="quizzes" className="mt-10">
        <TabsList>
          <TabsTrigger value="quizzes">Recommended</TabsTrigger>
          <TabsTrigger value="subjects">By subject</TabsTrigger>
          <TabsTrigger value="mock">Mock tests</TabsTrigger>
        </TabsList>

        <TabsContent value="quizzes" className="mt-6 grid gap-4 lg:grid-cols-2">
          {chapters.slice(0, 6).map((ch) => (
            <Card key={ch.id} className="surface-card">
              <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5">
                <div className="min-w-0">
                  <Badge variant="secondary" className="mb-2">
                    {subjects.find((s) => s.id === ch.subjectId)?.name}
                  </Badge>
                  <p className="truncate text-sm font-semibold">{ch.title} quiz</p>
                  <p className="text-xs text-muted-foreground">
                    15 questions · mixed difficulty · ~12 min
                  </p>
                </div>
                <Button size="sm" className="shrink-0">
                  Start <ArrowRight />
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="subjects" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {subjects.map((s) => (
            <Card key={s.id} className="surface-card lift-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{s.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {s.chapters} chapters · {s.topics} topics of practice
                </p>
                <Button size="sm" variant="soft" className="mt-4">
                  Practise
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="mock" className="mt-6 grid gap-4 lg:grid-cols-2">
          {["Half-yearly mock paper", "Full syllabus mock paper", "Previous-year style paper"].map(
            (title) => (
              <Card key={title} className="surface-card">
                <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">80 marks · 3 hours · timed</p>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0">
                    Attempt
                  </Button>
                </CardContent>
              </Card>
            ),
          )}
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
