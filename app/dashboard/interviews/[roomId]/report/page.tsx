import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getServerSession } from "next-auth";

import { PrintButton } from "@/components/dashboard/print-button";
import { SiteHeader } from "@/components/site/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AUTH_BYPASS_ENABLED, authOptions, getBypassSession } from "@/lib/auth";
import { getMongoCollections } from "@/lib/db";

export const dynamic = "force-dynamic";

type InterviewReportPageProps = {
  params: Promise<{ roomId: string }>;
};

function toUiStatus(status: unknown) {
  if (status === "scheduled" || status === "ongoing" || status === "completed") return status;
  if (status === "created") return "scheduled";
  if (status === "started") return "ongoing";
  if (status === "ended") return "completed";
  return "scheduled";
}

export default async function InterviewReportPage({ params }: InterviewReportPageProps) {
  const session = AUTH_BYPASS_ENABLED ? getBypassSession() : await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  if (role !== "admin" && role !== "interviewer") {
    redirect("/");
  }

  const { roomId } = await params;

  const { Interviews, Messages, CodeSnapshots } = await getMongoCollections();
  const [interview, messages, snapshots] = await Promise.all([
    Interviews.findOne({ roomId }),
    Messages.find({ roomId }).sort({ createdAt: 1 }).limit(1500).toArray(),
    CodeSnapshots.find({ roomId }).sort({ createdAt: -1 }).limit(50).toArray(),
  ]);

  if (!interview) {
    notFound();
  }

  const notes = typeof interview.notes === "string" ? interview.notes : "";
  const rating = typeof interview.rating === "number" ? interview.rating : null;
  const statusLabel = toUiStatus(interview.status);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900 print:bg-white">
      <div className="print:hidden">
        <SiteHeader className="border-b border-transparent" />
      </div>

      <main className="w-full px-4 py-8 sm:px-8 lg:px-10 2xl:px-16 print:max-w-none print:px-0 print:py-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between print:hidden">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
              Report
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
              Interview report
            </h1>
            <div className="mt-2 text-sm text-slate-600 dark:text-zinc-400">
              Room: <span className="font-mono font-medium">{roomId}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={`/dashboard/interviews/${roomId}`}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
            >
              Back
            </Link>
            <PrintButton className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              Print / Save PDF
            </PrintButton>
          </div>
        </div>

        <div className="mt-6 grid gap-4 print:mt-0">
          <Card className="print:rounded-none print:shadow-none print:ring-0">
            <CardHeader className="print:pb-3">
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="print:pt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                    Title
                  </div>
                  <div className="mt-1 text-sm font-semibold text-slate-900 dark:text-zinc-50">
                    {interview.title || "Interview"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                    Status
                  </div>
                  <div className="mt-1 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-zinc-900 dark:text-zinc-200">
                    {statusLabel}
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
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
                    Rating
                  </div>
                  <div className="mt-1 text-sm text-slate-900 dark:text-zinc-50">
                    {rating === null ? "Not rated" : `${rating} / 5`}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="print:rounded-none print:shadow-none print:ring-0">
            <CardHeader className="print:pb-3">
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="print:pt-0">
              {notes ? (
                <div className="whitespace-pre-wrap break-words text-sm text-slate-900 dark:text-zinc-50">
                  {notes}
                </div>
              ) : (
                <div className="text-sm text-slate-600 dark:text-zinc-400">No notes.</div>
              )}
            </CardContent>
          </Card>

          <Card className="print:rounded-none print:shadow-none print:ring-0">
            <CardHeader className="print:pb-3">
              <CardTitle>Chat transcript</CardTitle>
            </CardHeader>
            <CardContent className="print:pt-0">
              {messages.length === 0 ? (
                <div className="text-sm text-slate-600 dark:text-zinc-400">No messages.</div>
              ) : (
                <div className="space-y-2">
                  {messages.map((m) => (
                    <div
                      key={String(m._id)}
                      className="rounded-2xl bg-white px-3 py-2 text-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 print:rounded-none print:ring-0"
                    >
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                        {m.sender} • {new Date(m.createdAt).toLocaleString()}
                      </div>
                      <div className="mt-1 whitespace-pre-wrap break-words text-slate-900 dark:text-zinc-50">
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="print:rounded-none print:shadow-none print:ring-0">
            <CardHeader className="print:pb-3">
              <CardTitle>Code snapshots</CardTitle>
            </CardHeader>
            <CardContent className="print:pt-0">
              {snapshots.length === 0 ? (
                <div className="text-sm text-slate-600 dark:text-zinc-400">No snapshots.</div>
              ) : (
                <div className="space-y-3">
                  {snapshots.map((s) => (
                    <div
                      key={String(s._id)}
                      className="rounded-2xl bg-white p-3 ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 print:rounded-none print:ring-0"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] font-semibold text-slate-600 dark:text-zinc-400">
                          {new Date(s.createdAt).toLocaleString()} • {s.language}
                        </div>
                        {s.clientId ? (
                          <div className="text-[11px] font-semibold text-slate-500 dark:text-zinc-500">{s.clientId}</div>
                        ) : null}
                      </div>
                      <pre className="mt-2 overflow-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-900 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:text-zinc-50 dark:ring-zinc-800 print:rounded-none print:ring-0">
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
