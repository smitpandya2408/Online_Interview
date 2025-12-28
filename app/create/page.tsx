"use client";

import * as React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreatePage() {
  const router = useRouter();
  const [isCreating, setIsCreating] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onCreate() {
    setError(null);
    setIsCreating(true);
    try {
      const res = await fetch("/api/create-room", {
        method: "POST",
      });
      const data = (await res.json()) as { roomId?: string; error?: string };

      if (!res.ok || !data.roomId) {
        setError(data.error || "Failed to create room");
        return;
      }

      router.push(`/room/${data.roomId}`);
    } catch {
      setError("Failed to create room");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Create interview room</CardTitle>
            <CardDescription>
              Generate a unique room ID and invite your candidate via link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <Button onClick={onCreate} disabled={isCreating}>
                {isCreating ? "Creating..." : "Generate Room Link"}
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
  );
}
