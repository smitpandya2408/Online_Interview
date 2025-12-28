"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";

type NotesCardProps = {
  roomId: string;
  initialNotes?: string;
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function NotesCard({ roomId, initialNotes = "" }: NotesCardProps) {
  const [notes, setNotes] = React.useState(initialNotes);
  const [saveState, setSaveState] = React.useState<SaveState>("idle");
  const [error, setError] = React.useState<string | null>(null);

  const lastSavedRef = React.useRef<string>(initialNotes);
  const debounceTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    setNotes(initialNotes);
    lastSavedRef.current = initialNotes;
    setSaveState("idle");
    setError(null);
  }, [initialNotes]);

  React.useEffect(() => {
    if (!roomId) return;
    if (notes === lastSavedRef.current) return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(async () => {
      setSaveState("saving");
      setError(null);

      try {
        const res = await fetch(`/api/rooms/${roomId}/notes`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes }),
        });

        if (!res.ok) {
          throw new Error("Failed to save notes");
        }

        lastSavedRef.current = notes;
        setSaveState("saved");
      } catch {
        setSaveState("error");
        setError("Could not save notes");
      }
    }, 700);

    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
    };
  }, [notes, roomId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Write interviewer notes here..."
          rows={6}
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-sm text-slate-600 dark:text-zinc-400">
            {saveState === "saving" ? "Saving..." : null}
            {saveState === "saved" ? "Saved" : null}
            {saveState === "idle" ? "" : null}
            {saveState === "error" ? "Save failed" : null}
          </div>
          {error ? (
            <div className="text-sm text-rose-700 dark:text-rose-200">{error}</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
