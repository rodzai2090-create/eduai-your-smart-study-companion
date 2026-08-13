import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Send, Paperclip, Camera, Lightbulb } from "lucide-react";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { subjects } from "@/lib/catalog";

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "AI Tutor — Ask Any Study Question | EduAI" },
      {
        name: "description",
        content:
          "Ask your AI tutor step-by-step questions about any chapter or topic in your syllabus, at any hour.",
      },
      { property: "og:title", content: "AI Tutor — EduAI" },
      {
        property: "og:description",
        content: "Step-by-step explanations for any topic in your syllabus.",
      },
    ],
  }),
  component: TutorPage,
});

const starters = [
  "Explain the quadratic formula with an example",
  "Why does light bend when it enters glass?",
  "Summarise Life Processes in 10 bullet points",
  "Give me 5 exam questions on Laws of Motion",
];

const sample = [
  { role: "student", text: "Can you explain Newton's second law simply?" },
  {
    role: "tutor",
    text: "Sure — here's how the tutor conversation will appear. Explanations arrive step by step, with worked examples and a short check-for-understanding question at the end.",
  },
];

function TutorPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="AI Tutor"
        title="Ask anything from your syllabus"
        description="A patient tutor for every subject, chapter and topic — available whenever you study."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="surface-card flex min-h-[520px] flex-col">
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-brand" /> Tutor session
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4 p-5">
            {sample.map((m, i) => (
              <div
                key={i}
                className={m.role === "student" ? "flex justify-end" : "flex justify-start"}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    m.role === "student"
                      ? "bg-brand text-brand-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {m.text}
                </p>
              </div>
            ))}
            <p className="text-center text-xs text-muted-foreground">
              Live tutoring responses are not connected yet — this is the interface preview.
            </p>
          </CardContent>
          <div className="border-t border-border p-4">
            <div className="flex flex-wrap gap-2 pb-3">
              {starters.map((s) => (
                <Badge key={s} variant="secondary" className="cursor-pointer font-normal">
                  {s}
                </Badge>
              ))}
            </div>
            <div className="grid gap-2">
              <Textarea placeholder="Type your question…" rows={3} />
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <div className="flex min-w-0 gap-2">
                  <Button variant="outline" size="icon" aria-label="Attach file">
                    <Paperclip />
                  </Button>
                  <Button variant="outline" size="icon" aria-label="Scan a question">
                    <Camera />
                  </Button>
                </div>
                <Button className="shrink-0">
                  Send <Send />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid content-start gap-4">
          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tutor context</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-muted-foreground">
              <p>Answers are scoped to the country, board and class set in your profile.</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {subjects.slice(0, 6).map((s) => (
                  <Badge key={s.id} variant="outline">
                    {s.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-highlight" /> Ways to use the tutor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm text-muted-foreground">
                <li>Step-by-step solutions for hard problems</li>
                <li>Simplified explanations of tough concepts</li>
                <li>Instant quizzes on any chapter</li>
                <li>Exam-style answer feedback</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
