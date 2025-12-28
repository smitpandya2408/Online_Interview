"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function JoinPage() {
  const router = useRouter();
  const [value, setValue] = React.useState("");
  const [isJoining, setIsJoining] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  function normalizeRoomId(input: string) {
    const trimmed = input.trim();
    if (!trimmed) return "";

    // Accept raw ID or a full URL like https://.../room/<id>
    const parts = trimmed.split("/").filter(Boolean);
    const maybeId = parts[parts.length - 1] || "";
    return maybeId.replace(/[^a-zA-Z0-9_-]/g, "");
  }

  async function onJoin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const roomId = normalizeRoomId(value);

    if (!roomId) {
      setError("Please enter a valid room ID");
      return;
    }

    setIsJoining(true);
    try {
      const res = await fetch("/api/validate-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId }),
      });
      const data = (await res.json()) as { roomId?: string; error?: string };

      if (!res.ok || !data.roomId) {
        setError(data.error || "Room not found");
        return;
      }

      router.push(`/room/${data.roomId}`);
    } catch {
      setError("Failed to join room");
    } finally {
      setIsJoining(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Join interview room</CardTitle>
            <CardDescription>
              Enter a room ID (or paste a full room link) to join.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onJoin} className="flex flex-col gap-3">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-900 dark:text-zinc-50">
                  Room link / ID
                </span>
                <Input
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g. abc123 or https://yourapp.com/room/abc123"
                  autoComplete="off"
                  inputMode="text"
                />
              </label>

              <Button type="submit" disabled={isJoining}>
                {isJoining ? "Joining..." : "Join Room"}
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
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
