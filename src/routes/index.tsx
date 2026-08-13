import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import heroImage from "@/assets/hero-study.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { subjects, countries } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduAI — AI Study Assistant for School Students" },
      {
        name: "description",
        content:
          "Learn your complete syllabus with AI tutoring, lessons, notes, quizzes, flashcards and study plans — for any country, board and class.",
      },
      { property: "og:title", content: "EduAI — AI Study Assistant for School Students" },
      {
        property: "og:description",
        content:
          "AI tutoring, lessons, quizzes, flashcards and study plans for any country, board and class.",
      },
    ],
  }),
  component: Home,
});

const steps = [
  { icon: Icons.MapPin, title: "Choose your curriculum", desc: "Pick your country, board or exam system, and class." },
  { icon: Icons.BookOpen, title: "Learn chapter by chapter", desc: "Structured lessons, notes and flashcards for every topic." },
  { icon: Icons.MessagesSquare, title: "Ask the AI tutor", desc: "Get step-by-step help the moment you're stuck." },
  { icon: Icons.LineChart, title: "Practise and track", desc: "Quizzes, mock tests and clear progress on your syllabus." },
];

const features = [
  { icon: Icons.Sparkles, title: "AI tutoring", desc: "Explanations at your level, for any topic in your syllabus." },
  { icon: Icons.NotebookPen, title: "Lessons & notes", desc: "Concise chapter notes you can revise in minutes." },
  { icon: Icons.Layers, title: "Flashcards", desc: "Spaced repetition that makes recall automatic." },
  { icon: Icons.ListChecks, title: "Quizzes & practice", desc: "Topic-wise questions graded by difficulty." },
  { icon: Icons.CalendarDays, title: "Study planner", desc: "A realistic weekly schedule built around your exams." },
  { icon: Icons.Trophy, title: "Progress tracking", desc: "See coverage, accuracy and weak topics at a glance." },
];

const testimonials = [
  { name: "Aarav S.", meta: "Class 10 · CBSE, India", quote: "I finally understand quadratic equations. The tutor breaks every step down instead of just giving the answer." },
  { name: "Leila H.", meta: "Year 11 · GCSE, UK", quote: "The planner keeps me honest. I know exactly what to revise each evening." },
  { name: "Chidi O.", meta: "SS2 · WAEC, Nigeria", quote: "Practice questions by topic helped my chemistry score go up a whole grade." },
];

function SubjectIcon({ name }: { name: string }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.BookOpen;
  return <Icon className="h-5 w-5" />;
}

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-soft border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div className="min-w-0">
            <Badge variant="secondary" className="mb-5">
              Built for students in every country
            </Badge>
            <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Learn your whole syllabus with an AI study partner
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              EduAI turns your board, class and subjects into guided lessons, notes, quizzes,
              flashcards and a study plan you can actually keep up with.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/learn">
                  Start Learning <Icons.ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/tutor">
                  <Icons.Sparkles /> Ask AI Tutor
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Icons.Globe2 className="h-4 w-4 text-brand" /> Multi-country & multi-board
              </span>
              <span className="flex items-center gap-2">
                <Icons.ShieldCheck className="h-4 w-4 text-brand" /> Syllabus-aligned content
              </span>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Students learning together with an AI study assistant"
              width={1280}
              height={960}
              className="w-full rounded-3xl border border-border shadow-[var(--shadow-lift)]"
            />
          </div>
        </div>
      </section>

      {/* Supported systems */}
      <section className="border-b border-border bg-background py-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Curricula supported
          </span>
          {countries.map((c) => (
            <Badge key={c.id} variant="outline" className="font-normal">
              {c.flag} {c.name}
            </Badge>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold sm:text-3xl">Every subject, chapter by chapter</h2>
            <p className="mt-3 text-muted-foreground">
              Subjects adapt to your board and class — more can be added as new curricula come
              online.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  <p className="mt-4 text-xs text-muted-foreground">
                    {s.chapters} chapters · {s.topics} topics
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">How EduAI works</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.title} className="min-w-0">
                <span className="grid h-11 w-11 place-items-center rounded-xl gradient-hero text-brand-foreground">
                  <s.icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">Everything you need to study well</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="surface-card lift-hover">
                <CardContent className="p-6">
                  <f.icon className="h-5 w-5 text-brand" />
                  <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Progress concept */}
      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold sm:text-3xl">Watch your syllabus fill up</h2>
            <p className="mt-3 text-muted-foreground">
              Every lesson, quiz and revision session updates one clear picture: how much of your
              syllabus is truly covered, and which topics still need work.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/progress">See progress view</Link>
              </Button>
              <Button asChild variant="soft">
                <Link to="/dashboard">Open dashboard</Link>
              </Button>
            </div>
          </div>

          <Card className="surface-card">
            <CardContent className="grid gap-5 p-6">
              {subjects.slice(0, 4).map((s, i) => {
                const value = [78, 64, 45, 88][i];
                return (
                  <div key={s.id} className="grid gap-2">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                      <p className="truncate text-sm font-medium">{s.name}</p>
                      <span className="text-xs text-muted-foreground">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                );
              })}
              <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="secondary">12-day streak</Badge>
                <Badge variant="secondary">146 lessons done</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">Students are already ahead</h2>
          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {testimonials.map((t) => (
              <Card key={t.name} className="surface-card">
                <CardContent className="p-6">
                  <div className="flex gap-1 text-highlight">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Icons.Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-foreground">"{t.quote}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-brand-soft text-xs text-brand">
                        {t.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{t.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{t.meta}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="gradient-hero rounded-3xl px-6 py-14 text-center text-brand-foreground sm:px-12">
            <h2 className="text-2xl font-bold sm:text-3xl">Start with today's chapter</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 sm:text-base">
              Set your country, board and class — EduAI builds the rest of your study path.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild variant="highlight" size="xl">
                <Link to="/learn">Start Learning</Link>
              </Button>
              <Button asChild variant="onbrand" size="xl">
                <Link to="/tutor">Ask AI Tutor</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
