"use client";

import * as React from "react";

type RatingEditorProps = {
  roomId: string;
  initialRating: number | null;
};

type SaveState = "idle" | "saving" | "saved" | "error";

export function RatingEditor({ roomId, initialRating }: RatingEditorProps) {
  const [rating, setRating] = React.useState<number | "">(initialRating ?? "");
  const [state, setState] = React.useState<SaveState>("idle");
  const [error, setError] = React.useState<string | null>(null);

  async function save(next: number) {
    setState("saving");
    setError(null);

    try {
      const res = await fetch(`/api/rooms/${roomId}/rating`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: next }),
      });

      if (!res.ok) throw new Error("Failed");
      setState("saved");
    } catch {
      setState("error");
      setError("Could not save rating");
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <select
          className="h-11 w-40 rounded-xl bg-white px-3 text-sm font-medium text-slate-900 ring-1 ring-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:focus:ring-zinc-700"
          value={rating}
          onChange={(e) => {
            const next = e.target.value === "" ? "" : Number(e.target.value);
            setRating(next);
            if (typeof next === "number" && Number.isFinite(next)) {
              void save(next);
            }
          }}
        >
          <option value="">Not rated</option>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} / 5
            </option>
          ))}
        </select>

        <div className="text-sm text-slate-600 dark:text-zinc-400">
          {state === "saving" ? "Saving..." : null}
          {state === "saved" ? "Saved" : null}
          {state === "error" ? "Save failed" : null}
        </div>
      </div>

      {error ? <div className="text-sm text-rose-700 dark:text-rose-200">{error}</div> : null}
    </div>
  );
}
