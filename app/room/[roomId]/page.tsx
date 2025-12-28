import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site/site-header";
import { ChatCard } from "@/components/room/chat-card";
import { EditorCard } from "@/components/room/editor-card";
import { NotesCard } from "@/components/room/notes-card";
import { TimerCard } from "@/components/room/timer-card";
import { VideoCard } from "@/components/room/video-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMongoCollections } from "@/lib/db";

export const dynamic = "force-dynamic";

type RoomPageProps = {
  params: Promise<{ roomId: string }>;
};

export default async function RoomPage({ params }: RoomPageProps) {
  const { roomId } = await params;

  const { Interviews } = await getMongoCollections();
  const interview = await Interviews.findOne({ roomId });

  if (!interview) {
    notFound();
  }

  if (interview.status === "ended") {
    notFound();
  }

  const durationMinutes =
    typeof interview.durationMinutes === "number" && Number.isFinite(interview.durationMinutes)
      ? interview.durationMinutes
      : 60;

  let startedAtIso: string | null = interview.startedAt
    ? new Date(interview.startedAt).toISOString()
    : null;

  if (interview.status === "created") {
    const now = new Date();
    startedAtIso = now.toISOString();
    await Interviews.updateOne(
      { roomId, status: "created" },
      { $set: { status: "started", startedAt: now } }
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
      <SiteHeader className="border-b border-transparent" />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
              Interview Room
            </h1>
            <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              Room ID: <span className="font-mono font-medium">{roomId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
            >
              Home
            </Link>
            <Link
              href="/join"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
            >
              Join another
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <VideoCard roomId={roomId} />
            <EditorCard
              roomId={roomId}
              initialCode={typeof interview.code === "string" ? interview.code : ""}
              initialLanguage={interview.language === "python" ? "python" : "javascript"}
            />
          </div>

          <div className="flex flex-col gap-4">
            <TimerCard roomId={roomId} startedAtIso={startedAtIso} durationMinutes={durationMinutes} />
            <NotesCard
              roomId={roomId}
              initialNotes={typeof interview.notes === "string" ? interview.notes : ""}
            />
            <ChatCard roomId={roomId} />
          </div>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                    Status
                  </div>
                  <div className="mt-1 text-sm text-slate-900 dark:text-zinc-50">
                    {interview.status}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                    Created
                  </div>
                  <div className="mt-1 text-sm text-slate-900 dark:text-zinc-50">
                    {new Date(interview.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
