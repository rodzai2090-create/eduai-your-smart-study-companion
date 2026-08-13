import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

const columns = [
  {
    title: "Learn",
    links: [
      { to: "/learn", label: "Lessons & Notes" },
      { to: "/practice", label: "Practice & Quizzes" },
      { to: "/tutor", label: "AI Tutor" },
      { to: "/planner", label: "Study Planner" },
    ],
  },
  {
    title: "Students",
    links: [
      { to: "/dashboard", label: "My Dashboard" },
      { to: "/progress", label: "Progress Tracking" },
      { to: "/profile", label: "Profile & Settings" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-hero text-brand-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-bold">EduAI</span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            An AI-powered study assistant built for school and high-school students worldwide —
            across every country, curriculum, class and subject.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/70">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} EduAI. Learning for every student, everywhere.</p>
          <p>Multi-country · Multi-board · Multi-language ready</p>
        </div>
      </div>
    </footer>
  );
}
