import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PageShell } from "@/components/site/PageHeader";
import { ContextPicker } from "@/components/site/ContextPicker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { subjects } from "@/lib/catalog";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Learning Settings | EduAI" },
      {
        name: "description",
        content:
          "Set your country, board, class, subjects, study goals and reminders so EduAI matches your curriculum.",
      },
      { property: "og:title", content: "Profile & Learning Settings — EduAI" },
      {
        property: "og:description",
        content: "Manage your curriculum context, subjects, goals and study reminders.",
      },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Profile"
        title="Your learning profile"
        description="EduAI adapts every lesson, quiz and plan to the details you set here."
        actions={<Button>Save changes</Button>}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-6">
          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Student details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" defaultValue="Zaina Maryam" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="student@example.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="school">School</Label>
                <Input id="school" placeholder="Your school name" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lang">Preferred language</Label>
                <Input id="lang" defaultValue="English" />
              </div>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              <ContextPicker />
              <p className="mt-3 text-xs text-muted-foreground">
                More countries, boards and classes can be added over time — nothing is fixed to a
                single system.
              </p>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">My subjects</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <Badge key={s.id} variant="secondary" className="cursor-pointer">
                  {s.name}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid content-start gap-4">
          <Card className="surface-card">
            <CardContent className="grid place-items-center gap-3 p-6 text-center">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-brand-soft text-brand">ZM</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">Zaina Maryam</p>
                <p className="text-xs text-muted-foreground">Class 10 · CBSE · India</p>
              </div>
              <Button variant="outline" size="sm">
                Change photo
              </Button>
            </CardContent>
          </Card>

          <Card className="surface-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Study preferences</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {[
                "Daily study reminders",
                "Weekly progress report",
                "Revision suggestions",
                "Exam countdown alerts",
              ].map((label, i) => (
                <div key={label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <Label className="text-sm font-normal">{label}</Label>
                  <Switch defaultChecked={i < 3} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
