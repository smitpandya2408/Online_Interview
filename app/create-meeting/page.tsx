"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CreateMeetingPage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [durationMinutes, setDurationMinutes] = React.useState<string>("60");
  const [scheduledAt, setScheduledAt] = React.useState<string>("");

  function parseDurationMinutes(input: string) {
    const n = Number(input);
    if (!Number.isFinite(n)) return null;
    const rounded = Math.floor(n);
    if (rounded < 1 || rounded > 480) return null;
    return rounded;
  }

  async function onCreate() {
    setError(null);
    setIsCreating(true);
    try {
      const duration = parseDurationMinutes(durationMinutes);
      if (!duration) {
        setError("Please enter a valid duration (1-480 minutes)");
        return;
      }

      const scheduledValue = scheduledAt.trim();
      if (scheduledValue) {
        const d = new Date(scheduledValue);
        if (Number.isNaN(d.getTime())) {
          setError("Please enter a valid scheduled date/time");
          return;
        }
      }

      const res = await fetch("/api/create-meeting-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          durationMinutes: duration,
          scheduledAt: scheduledValue || undefined,
          isMeeting: true,
        }),
      });
      const data = (await res.json()) as { roomId?: string; error?: string };

      if (!res.ok || !data.roomId) {
        setError(data.error || "Failed to create meeting room");
        return;
      }

      router.push(`/room/${data.roomId}`);
    } catch {
      setError("Failed to create meeting room");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full px-4 py-10 sm:px-8 lg:px-10 2xl:px-16">
        <div className="mx-auto w-full max-w-xl">
          <Card className="animate-fade-in hover-lift">
            <CardHeader>
              <CardTitle>Create meeting room</CardTitle>
              <CardDescription>
                Generate a unique room ID for your meeting without interview features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-zinc-50">
                    Duration (minutes)
                  </span>
                  <Input
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    placeholder="e.g. 60"
                    inputMode="numeric"
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-900 dark:text-zinc-50">
                    Schedule (optional)
                  </span>
                  <Input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                  />
                </label>

                <Button onClick={onCreate} disabled={isCreating}>
                  {isCreating ? "Creating..." : "Generate Meeting Room Link"}
                </Button>

                {error ? (
                  <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900/60">
                    {error}
                  </div>
                ) : null}

                <Link
                  href="/"
                  className="text-sm font-medium text-slate-700 hover:text-slate-950 dark:text-zinc-300 dark:hover:text-white"
                >
                  Back to Home
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
