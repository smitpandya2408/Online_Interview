"use client";

import * as React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TimerCardProps = {
  startedAtIso?: string | null;
  durationMinutes?: number;
};

function formatDuration(totalSeconds: number) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function TimerCard({ startedAtIso, durationMinutes = 60 }: TimerCardProps) {
  const [mounted, setMounted] = React.useState(false);
  const [nowMs, setNowMs] = React.useState<number | null>(null);

  React.useEffect(() => {
    setMounted(true);
    setNowMs(Date.now());
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const startedAtMs = React.useMemo(() => {
    if (!startedAtIso) return null;
    const ms = new Date(startedAtIso).getTime();
    return Number.isFinite(ms) ? ms : null;
  }, [startedAtIso]);

  const totalMs = durationMinutes * 60 * 1000;
  const elapsedMs =
    mounted && startedAtMs && nowMs ? Math.max(0, nowMs - startedAtMs) : 0;
  const remainingMs = Math.max(0, totalMs - elapsedMs);

  const warningMs = 5 * 60 * 1000;
  const isRunning = Boolean(mounted && startedAtMs);
  const isWarning = isRunning && remainingMs > 0 && remainingMs <= warningMs;
  const isEnded = isRunning && remainingMs === 0;

  const elapsedLabel = isRunning ? formatDuration(elapsedMs / 1000) : "--:--";
  const remainingLabel = isRunning ? formatDuration(remainingMs / 1000) : "--:--";

  return (
    <Card
      className={cn(
        isWarning && "ring-amber-200 dark:ring-amber-900/60",
        isEnded && "ring-rose-200 dark:ring-rose-900/60"
      )}
    >
      <CardHeader>
        <CardTitle>Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
              Elapsed
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
              {elapsedLabel}
            </div>
          </div>

          <div
            className={cn(
              "rounded-2xl p-4 ring-1",
              isEnded
                ? "bg-rose-50 ring-rose-200 dark:bg-rose-950/25 dark:ring-rose-900/60"
                : isWarning
                  ? "bg-amber-50 ring-amber-200 dark:bg-amber-950/20 dark:ring-amber-900/60"
                  : "bg-slate-50 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800"
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                Remaining
              </div>
              {isWarning ? (
                <div className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:text-amber-200">
                  5 min left
                </div>
              ) : null}
              {isEnded ? (
                <div className="rounded-full bg-rose-500/15 px-2 py-0.5 text-[11px] font-semibold text-rose-800 dark:text-rose-200">
                  Time
                </div>
              ) : null}
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
              {remainingLabel}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-zinc-400">
          {isRunning
            ? `Session duration: ${durationMinutes} minutes.`
            : "Starts automatically when the interview begins."}
        </div>
      </CardContent>
    </Card>
  );
}
