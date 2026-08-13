import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContextPicker } from "@/components/site/ContextPicker";

export const navItems = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "My Dashboard" },
  { to: "/learn", label: "Learn" },
  { to: "/tutor", label: "AI Tutor" },
  { to: "/planner", label: "Study Planner" },
  { to: "/practice", label: "Practice" },
  { to: "/progress", label: "Progress" },
  { to: "/profile", label: "Profile" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl gradient-hero text-brand-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="truncate font-display text-lg font-bold tracking-tight">EduAI</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-brand-soft text-brand" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden lg:block">
            <ContextPicker compact />
          </div>
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/learn">Start Learning</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-2 xl:hidden">
          <nav className="grid gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                activeProps={{ className: "bg-brand-soft text-brand" }}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 lg:hidden">
            <ContextPicker />
          </div>
        </div>
      )}
    </header>
  );
}
