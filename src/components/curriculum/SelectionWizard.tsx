import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Check, Loader2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  boardsQuery,
  chaptersQuery,
  classesQuery,
  countriesQuery,
  subjectsQuery,
  topicsQuery,
} from "@/lib/curriculum";

type Picked = { id: string; label: string } | null;

export type CurriculumSelection = {
  country: Picked;
  board: Picked;
  class: Picked;
  subject: Picked;
  chapter: Picked;
  topic: Picked;
};

const STORAGE_KEY = "eduai.curriculum-selection";

const emptySelection: CurriculumSelection = {
  country: null,
  board: null,
  class: null,
  subject: null,
  chapter: null,
  topic: null,
};

const steps = [
  { key: "country", title: "Select your country", hint: "Where do you study?" },
  { key: "board", title: "Select your education board", hint: "Board or education system" },
  { key: "class", title: "Select your class", hint: "Class or grade level" },
  { key: "subject", title: "Select a subject", hint: "Subjects offered for this class" },
  { key: "chapter", title: "Select a chapter", hint: "Chapters in this subject" },
  { key: "topic", title: "Select a topic", hint: "Topics in this chapter" },
] as const;

function OptionGrid({
  items,
  selectedId,
  onSelect,
  isLoading,
  emptyLabel,
}: {
  items: { id: string; label: string; sub?: string | null }[];
  selectedId: string | undefined;
  onSelect: (item: { id: string; label: string }) => void;
  isLoading: boolean;
  emptyLabel: string;
}) {
  if (isLoading) {
    return (
      <div className="grid place-items-center gap-2 py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <p className="text-sm">Loading options…</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center text-muted-foreground">
        <Inbox className="h-5 w-5" />
        <p className="max-w-sm text-sm">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const active = item.id === selectedId;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect({ id: item.id, label: item.label })}
            className={`group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border p-4 text-left transition-all ${
              active
                ? "border-brand bg-brand-soft"
                : "border-border bg-card hover:border-brand/50 hover:shadow-sm"
            }`}
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{item.label}</span>
              {item.sub && (
                <span className="mt-1 block truncate text-xs text-muted-foreground">
                  {item.sub}
                </span>
              )}
            </span>
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border ${
                active ? "border-brand bg-brand text-brand-foreground" : "border-border"
              }`}
            >
              {active && <Check className="h-3.5 w-3.5" />}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SelectionWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [selection, setSelection] = useState<CurriculumSelection>(emptySelection);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSelection({ ...emptySelection, ...JSON.parse(raw) });
    } catch {
      /* ignore malformed storage */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selection));
    } catch {
      /* storage unavailable */
    }
  }, [selection]);

  const countries = useQuery(countriesQuery);
  const boards = useQuery(boardsQuery(selection.country?.id ?? null));
  const classes = useQuery(classesQuery(selection.board?.id ?? null));
  const subjects = useQuery(subjectsQuery(selection.class?.id ?? null));
  const chapters = useQuery(chaptersQuery(selection.subject?.id ?? null));
  const topics = useQuery(topicsQuery(selection.chapter?.id ?? null));

  const step = steps[stepIndex]!;

  const pick = (key: keyof CurriculumSelection, item: { id: string; label: string }) => {
    setSelection((prev) => {
      const next = { ...prev, [key]: item };
      // Clear everything downstream so filters stay consistent.
      const order: (keyof CurriculumSelection)[] = [
        "country",
        "board",
        "class",
        "subject",
        "chapter",
        "topic",
      ];
      order.slice(order.indexOf(key) + 1).forEach((k) => {
        next[k] = null;
      });
      return next;
    });
  };

  const currentValue = selection[step.key];

  const config = {
    country: {
      isLoading: countries.isLoading,
      items: (countries.data ?? []).map((c) => ({ id: c.id, label: c.name, sub: c.code })),
      empty: "No countries have been published yet.",
    },
    board: {
      isLoading: boards.isFetching,
      items: (boards.data ?? []).map((b) => ({
        id: b.id,
        label: `${b.code} — ${b.name}`,
        sub: b.description,
      })),
      empty: "No education boards are available for this country yet.",
    },
    class: {
      isLoading: classes.isFetching,
      items: (classes.data ?? []).map((c) => ({ id: c.id, label: c.name, sub: `Level ${c.level}` })),
      empty: "No classes are available for this board yet.",
    },
    subject: {
      isLoading: subjects.isFetching,
      items: (subjects.data ?? []).map((s) => ({ id: s.id, label: s.name, sub: s.description })),
      empty: "No subjects have been added for this class yet.",
    },
    chapter: {
      isLoading: chapters.isFetching,
      items: (chapters.data ?? []).map((c) => ({
        id: c.id,
        label: `${c.chapter_number}. ${c.name}`,
        sub: c.description,
      })),
      empty: "No chapters have been published for this subject yet.",
    },
    topic: {
      isLoading: topics.isFetching,
      items: (topics.data ?? []).map((t) => ({
        id: t.id,
        label: `${t.topic_number}. ${t.name}`,
        sub: t.description,
      })),
      empty: "No topics have been published for this chapter yet.",
    },
  }[step.key];

  const crumbs = steps
    .map((s) => selection[s.key])
    .filter((v): v is { id: string; label: string } => Boolean(v));

  return (
    <div className="grid gap-6">
      <Card className="surface-card">
        <CardContent className="p-4 sm:p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Your selection
          </p>
          {crumbs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing selected yet.</p>
          ) : (
            <ol className="flex flex-wrap items-center gap-1.5 text-sm">
              {crumbs.map((c, i) => (
                <li key={c.id} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                  <span className="rounded-lg bg-brand-soft px-2 py-1 font-medium text-brand">
                    {c.label}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <button
            key={s.key}
            type="button"
            disabled={i > 0 && !selection[steps[i - 1]!.key]}
            onClick={() => setStepIndex(i)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
              i === stepIndex
                ? "bg-brand text-brand-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {i + 1}. {s.key === "class" ? "Class" : s.key[0]!.toUpperCase() + s.key.slice(1)}
          </button>
        ))}
      </div>

      <Card className="surface-card">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">{step.title}</h2>
              <p className="text-sm text-muted-foreground">{step.hint}</p>
            </div>
            <Badge variant="secondary">
              Step {stepIndex + 1} of {steps.length}
            </Badge>
          </div>

          <OptionGrid
            items={config.items}
            selectedId={currentValue?.id}
            onSelect={(item) => pick(step.key, item)}
            isLoading={config.isLoading}
            emptyLabel={config.empty}
          />

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <Button
              variant="outline"
              disabled={stepIndex === 0}
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
            >
              Back
            </Button>
            {stepIndex < steps.length - 1 ? (
              <Button disabled={!currentValue} onClick={() => setStepIndex((i) => i + 1)}>
                Continue
              </Button>
            ) : (
              <Button asChild disabled={!currentValue}>
                <Link to="/learn">Start learning</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
