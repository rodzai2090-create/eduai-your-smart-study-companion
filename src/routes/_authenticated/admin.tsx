import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { entities, isCurrentUserAdmin, type EntityKey } from "@/lib/curriculum-admin";
import { EntityManager } from "@/components/admin/EntityManager";
import { PageHeader } from "@/components/site/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Curriculum admin — EduAI" },
      {
        name: "description",
        content:
          "Manage EduAI curriculum content: add, edit and activate countries, boards, classes, subjects, chapters and topics.",
      },
      { property: "og:title", content: "Curriculum admin — EduAI" },
      {
        property: "og:description",
        content: "Add, edit and publish curriculum content across countries, boards, classes and subjects.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [selected, setSelected] = useState<Partial<Record<EntityKey, string | null>>>({});

  const access = useQuery({
    queryKey: ["admin", "access"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) return { email: null, isAdmin: false };
      return { email: data.user.email ?? null, isAdmin: await isCurrentUserAdmin(data.user.id) };
    },
  });

  const onSelect = (key: EntityKey, id: string | null) => {
    setSelected((prev) => {
      const next: Partial<Record<EntityKey, string | null>> = { ...prev, [key]: id };
      // Reset descendants when an ancestor changes.
      const order = entities.map((e) => e.key);
      const idx = order.indexOf(key);
      for (const child of order.slice(idx + 1)) next[child] = null;
      return next;
    });
  };

  if (access.isLoading) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!access.data?.isAdmin) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20">
        <Card>
          <CardContent className="grid gap-4 p-8 text-center">
            <ShieldAlert className="mx-auto h-8 w-8 text-muted-foreground" />
            <h1 className="font-display text-xl font-semibold">Admin access required</h1>
            <p className="text-sm text-muted-foreground">
              {access.data?.email
                ? `${access.data.email} doesn't have the administrator role yet.`
                : "Sign in with an administrator account to manage the curriculum."}
            </p>
            <div className="flex justify-center gap-2">
              <Button asChild variant="outline">
                <Link to="/">Back to EduAI</Link>
              </Button>
              <Button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/auth";
                }}
              >
                Switch account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <PageHeader
        eyebrow="Administration"
        title="Curriculum management"
        description="Add, edit and publish every level of the curriculum — no code changes needed."
      />

      <Tabs defaultValue="countries" className="mt-8">
        <TabsList className="flex h-auto flex-wrap justify-start">
          {entities.map((entity) => (
            <TabsTrigger key={entity.key} value={entity.key}>
              {entity.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {entities.map((entity) => (
          <TabsContent key={entity.key} value={entity.key} className="mt-6">
            <EntityManager config={entity} selected={selected} onSelect={onSelect} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
