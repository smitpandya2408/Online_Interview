import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { NotesEditor } from "@/components/dashboard/notes-editor";
import { RatingEditor } from "@/components/dashboard/rating-editor";
import { DeleteRoomButton } from "@/components/dashboard/delete-room-button";
import { SiteHeader } from "@/components/site/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMongoCollections } from "@/lib/db";

export const dynamic = "force-dynamic";

type InterviewDetailPageProps = {
  params: Promise<{ roomId: string }>;
};

function toUiStatus(status: unknown) {
  if (status === "scheduled" || status === "ongoing" || status === "completed") return status;
  if (status === "created") return "scheduled";
  if (status === "started") return "ongoing";
  if (status === "ended") return "completed";
  return "scheduled";
}

export default async function InterviewDetailPage({ params }: InterviewDetailPageProps) {
  // Everyone has admin access now
  const role = "admin";

  const { roomId } = await params;

  const { Interviews, Messages, CodeSnapshots } = await getMongoCollections();
  const [interview, messages, snapshots] = await Promise.all([
    Interviews.findOne({ roomId }),
    Messages.find({ roomId }).sort({ createdAt: 1 }).limit(500).toArray(),
    CodeSnapshots.find({ roomId }).sort({ createdAt: -1 }).limit(200).toArray(),
  ]);

  if (!interview) {
    notFound();
  }

  const notes = typeof interview.notes === "string" ? interview.notes : "";
  const rating = typeof interview.rating === "number" ? interview.rating : null;

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
      <SiteHeader className="border-b border-transparent" />

      <main className="w-full px-4 py-8 sm:px-8 lg:px-10 2xl:px-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
              Interview
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
              {interview.title || "Interview"}
            </h1>
            <div className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
              Room: <span className="font-mono font-medium">{roomId}</span>
            </div>
            <div className="mt-3 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-zinc-900 dark:text-zinc-200">
              {toUiStatus(interview.status)}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/dashboard"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
            >
              Back
            </Link>
            <Link
              href={`/room/${roomId}`}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
            >
              Open room
            </Link>
            <DeleteRoomButton roomId={roomId} variant="header" onDeletedHref="/dashboard" />
            <Link
              href={`/dashboard/interviews/${roomId}/report`}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Export PDF
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <NotesEditor roomId={roomId} initialNotes={notes} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingEditor roomId={roomId} initialRating={rating} />
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Chat history</CardTitle>
            </CardHeader>
            <CardContent>
              {messages.length === 0 ? (
                <div className="py-4 text-sm text-slate-600 dark:text-zinc-400">No messages yet.</div>
              ) : (
                <div className="max-h-[520px] overflow-y-auto rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                  <div className="flex flex-col gap-2">
                    {messages.map((m) => (
                      <div key={String(m._id)} className="rounded-2xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                        <div className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                          {m.sender} • {new Date(m.createdAt).toLocaleString()}
                        </div>
                        <div className="mt-1 whitespace-pre-wrap break-words text-slate-900 dark:text-zinc-50">{m.text}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code snapshots</CardTitle>
            </CardHeader>
            <CardContent>
              {snapshots.length === 0 ? (
                <div className="py-4 text-sm text-slate-600 dark:text-zinc-400">No snapshots yet.</div>
              ) : (
                <div className="max-h-[520px] overflow-y-auto space-y-3">
                  {snapshots.map((s) => (
                    <div key={String(s._id)} className="rounded-2xl bg-white p-3 ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                          {new Date(s.createdAt).toLocaleString()} • {s.language}
                        </div>
                        {s.clientId ? (
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-500">{s.clientId}</div>
                        ) : null}
                      </div>
                      <pre className="mt-2 max-h-56 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-900 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:text-zinc-50 dark:ring-zinc-800">
                        <code>{s.code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
