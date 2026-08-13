import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { ContextPicker } from "@/components/site/ContextPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { subjects, chapters } from "@/lib/catalog";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn Your Syllabus — EduAI Lessons & Notes" },
      {
        name: "description",
        content:
          "Browse subjects, chapters and topics for your country, board and class. Structured lessons, notes and flashcards in one place.",
      },
      { property: "og:title", content: "Learn Your Syllabus — EduAI" },
      {
        property: "og:description",
        content: "Structured lessons, notes and flashcards mapped to your curriculum.",
      },
    ],
  }),
  component: LearnPage,
});

function SubjectIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.BookOpen;
  return <Icon className="h-5 w-5" />;
}

function LearnPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Learn"
        title="Your complete syllabus"
        description="Pick your country, curriculum and class — then work through subjects, chapters and topics at your own pace."
      />

      <Card className="surface-card mt-6">
        <CardContent className="p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Learning context
          </p>
          <ContextPicker />
        </CardContent>
      </Card>

      <Tabs defaultValue="subjects" className="mt-8">
        <TabsList>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="notes">Notes & Flashcards</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subjects.map((s) => (
              <Card key={s.id} className="surface-card lift-hover">
                <CardContent className="p-5">
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                      <SubjectIcon name={s.icon} />
                    </span>
                    <h3 className="truncate text-base font-semibold">{s.name}</h3>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{s.blurb}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <Badge variant="secondary">{s.chapters} chapters</Badge>
                    <Badge variant="secondary">{s.topics} topics</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="chapters" className="mt-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {chapters.map((ch) => (
              <Card key={ch.id} className="surface-card">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{ch.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {subjects.find((s) => s.id === ch.subjectId)?.name}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="grid gap-1.5 text-sm text-muted-foreground">
                    {ch.topics.map((t) => (
                      <li key={t} className="flex items-center gap-2">
                        <Icons.Dot className="h-4 w-4 shrink-0 text-brand" />
                        <span className="truncate">{t}</span>
                      </li>
                    ))}
                  </ul>
                  <Progress value={ch.progress} className="mt-4 h-2" />
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm">Open lesson</Button>
                    <Button size="sm" variant="soft" asChild>
                      <Link to="/tutor">Ask AI Tutor</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {chapters.slice(0, 6).map((ch) => (
              <Card key={ch.id} className="surface-card lift-hover">
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-3">
                    {subjects.find((s) => s.id === ch.subjectId)?.name}
                  </Badge>
                  <h3 className="text-sm font-semibold">{ch.title} — summary notes</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Condensed notes plus a flashcard deck generated from every topic in this
                    chapter.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline">
                      Notes
                    </Button>
                    <Button size="sm" variant="outline">
                      Flashcards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
