import { useCallback, useEffect, useState } from "react";
import { MessageSquare, CalendarDays, Trash2, Mail, Check } from "lucide-react";
import {
  deleteSubmission,
  fetchFormSubmissions,
  markSubmissionRead,
  subscribeCmsStore,
} from "@/lib/cms-store";
import type { FormSubmission } from "@/lib/cms-types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";

function SubmissionCard({ sub, onRead, onDelete }: {
  sub: FormSubmission;
  onRead: () => void;
  onDelete: () => void;
}) {
  const Icon = sub.type === "speak_up" ? MessageSquare : CalendarDays;
  const title = sub.type === "speak_up" ? "Speak Up" : "Book a Meeting";

  return (
    <Card className={sub.read ? "opacity-80" : "border-accent/40 shadow-soft"}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-display">{title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {format(parseISO(sub.createdAt), "EEEE, d MMMM yyyy · h:mm a")}
              </p>
            </div>
          </div>
          {!sub.read && <Badge>New</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <dl className="grid gap-2 text-sm">
          {Object.entries(sub.data).map(([key, value]) => (
            <div key={key} className="grid sm:grid-cols-[120px_1fr] gap-1 sm:gap-3">
              <dt className="font-medium text-muted-foreground capitalize">{key.replace(/_/g, " ")}</dt>
              <dd className="text-foreground break-words">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex gap-2 pt-2">
          {!sub.read && (
            <Button size="sm" variant="outline" onClick={onRead}>
              <Check className="h-3.5 w-3.5 mr-1" /> Mark read
            </Button>
          )}
          <Button size="sm" variant="ghost" className="text-destructive" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SubmissionsAdmin() {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setSubmissions(await fetchFormSubmissions());
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
    return subscribeCmsStore(() => { void refresh(); });
  }, [refresh]);

  const speakUp = submissions.filter((s) => s.type === "speak_up");
  const appointments = submissions.filter((s) => s.type === "appointment");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 rounded-full border-4 border-muted border-t-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-3xl font-bold">Form Responses</h1>
        <p className="text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
          <Mail className="h-4 w-4" />
          Stored in Supabase and emailed via Web3Forms when configured.
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
          <TabsTrigger value="speak_up">Speak Up ({speakUp.length})</TabsTrigger>
          <TabsTrigger value="appointment">Meetings ({appointments.length})</TabsTrigger>
        </TabsList>

        {(["all", "speak_up", "appointment"] as const).map((tab) => {
          const list = tab === "all" ? submissions : submissions.filter((s) => s.type === tab);
          return (
            <TabsContent key={tab} value={tab} className="space-y-4 mt-4">
              {list.length === 0 ? (
                <p className="text-muted-foreground py-12 text-center">No submissions in this category yet.</p>
              ) : (
                list.map((sub) => (
                  <SubmissionCard
                    key={sub.id}
                    sub={sub}
                    onRead={() => {
                      void markSubmissionRead(sub.id).then(refresh);
                    }}
                    onDelete={() => {
                      if (confirm("Delete this submission?")) {
                        void deleteSubmission(sub.id).then(() => {
                          void refresh();
                          toast({ title: "Submission deleted" });
                        });
                      }
                    }}
                  />
                ))
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
