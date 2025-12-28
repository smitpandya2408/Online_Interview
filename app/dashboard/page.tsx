import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerSession } from "next-auth/next";

import { SiteHeader } from "@/components/site/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getMongoCollections } from "@/lib/db";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams?: Promise<{ status?: string }>;
};

function normalizeStatus(input: unknown) {
  if (input === "scheduled" || input === "ongoing" || input === "completed") return input;
  if (input === "created" || input === "started" || input === "ended") return input;
  return "all";
}

function toUiStatus(status: unknown) {
  if (status === "scheduled" || status === "ongoing" || status === "completed") return status;
  if (status === "created") return "scheduled";
  if (status === "started") return "ongoing";
  if (status === "ended") return "completed";
  return "scheduled";
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  if (role !== "admin" && role !== "interviewer") {
    redirect("/");
  }

  const sp = (await searchParams) || {};
  const statusFilter = normalizeStatus(sp.status);

  const { Interviews } = await getMongoCollections();

  const query: Record<string, unknown> = {};
  if (statusFilter !== "all") {
    if (statusFilter === "scheduled") query.status = { $in: ["scheduled", "created"] };
    if (statusFilter === "ongoing") query.status = { $in: ["ongoing", "started"] };
    if (statusFilter === "completed") query.status = { $in: ["completed", "ended"] };
    if (statusFilter === "created" || statusFilter === "started" || statusFilter === "ended") {
      query.status = statusFilter;
    }
  }

  const [interviews, totalInterviews, ratingAgg, statusAgg] = await Promise.all([
    Interviews.find(query).sort({ createdAt: -1 }).limit(100).toArray(),
    Interviews.countDocuments({}),
    Interviews.aggregate([
      { $match: { rating: { $type: "number" } } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]).toArray(),
    Interviews.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]).toArray(),
  ]);

  const avgRating =
    ratingAgg.length > 0 && typeof ratingAgg[0]?.avg === "number" ? (ratingAgg[0].avg as number) : null;
  const ratedCount =
    ratingAgg.length > 0 && typeof ratingAgg[0]?.count === "number" ? (ratingAgg[0].count as number) : 0;

  const byStatus = new Map<string, number>();
  for (const row of statusAgg) {
    if (!row || typeof row !== "object") continue;
    const status = (row as { _id?: unknown })._id;
    const count = (row as { count?: unknown }).count;
    if (typeof status === "string" && typeof count === "number") {
      byStatus.set(status, count);
    }
  }

  const scheduledCount = (byStatus.get("scheduled") || 0) + (byStatus.get("created") || 0);
  const ongoingCount = (byStatus.get("ongoing") || 0) + (byStatus.get("started") || 0);
  const completedCount = (byStatus.get("completed") || 0) + (byStatus.get("ended") || 0);

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
      <SiteHeader className="border-b border-transparent" />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
              Dashboard
            </h1>
            <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              Signed in as <span className="font-medium">{session.user.email}</span>
            </div>
          </div>

          <Link
            href="/create"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Create Room
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="transition-shadow hover:shadow-sm">
            <CardHeader>
              <CardTitle>Total interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                {totalInterviews}
              </div>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-sm">
            <CardHeader>
              <CardTitle>Average rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                {avgRating === null ? "—" : avgRating.toFixed(2)}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-zinc-500">Based on {ratedCount} rated interviews</div>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-sm">
            <CardHeader>
              <CardTitle>Scheduled</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                {scheduledCount}
              </div>
              <div className="mt-2">
                <Link
                  href="/dashboard?status=scheduled"
                  className="text-sm font-medium text-slate-700 underline-offset-4 hover:underline dark:text-zinc-300"
                >
                  View
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-sm">
            <CardHeader>
              <CardTitle>Ongoing / Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Ongoing</div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">{ongoingCount}</div>
                  <Link
                    href="/dashboard?status=ongoing"
                    className="mt-1 inline-block text-sm font-medium text-slate-700 underline-offset-4 hover:underline dark:text-zinc-300"
                  >
                    View
                  </Link>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Completed</div>
                  <div className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">{completedCount}</div>
                  <Link
                    href="/dashboard?status=completed"
                    className="mt-1 inline-block text-sm font-medium text-slate-700 underline-offset-4 hover:underline dark:text-zinc-300"
                  >
                    View
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2 transition-shadow hover:shadow-sm">
            <CardHeader>
              <CardTitle>Interviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Link
                  href="/dashboard"
                  className={
                    statusFilter === "all"
                      ? "rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
                      : "rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                  }
                >
                  All
                </Link>
                <Link
                  href="/dashboard?status=scheduled"
                  className={
                    statusFilter === "scheduled"
                      ? "rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
                      : "rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                  }
                >
                  Scheduled
                </Link>
                <Link
                  href="/dashboard?status=ongoing"
                  className={
                    statusFilter === "ongoing"
                      ? "rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
                      : "rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                  }
                >
                  Ongoing
                </Link>
                <Link
                  href="/dashboard?status=completed"
                  className={
                    statusFilter === "completed"
                      ? "rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
                      : "rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                  }
                >
                  Completed
                </Link>
              </div>
              {interviews.length === 0 ? (
                <div className="py-8 text-sm text-slate-600 dark:text-zinc-400">No interviews yet.</div>
              ) : (
                <>
                  <div className="hidden overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-zinc-800 md:block">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-zinc-900/40 dark:text-zinc-500">
                        <tr>
                          <th className="px-4 py-3">Interview</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3">Created</th>
                          <th className="px-4 py-3" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
                        {interviews.map((i) => (
                          <tr key={String(i._id)} className="transition-colors hover:bg-slate-50 dark:hover:bg-zinc-900/50">
                            <td className="px-4 py-4">
                              <div className="font-semibold text-slate-900 dark:text-zinc-50">
                                {i.title || "Interview"}
                              </div>
                              <div className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                                Room: <span className="font-mono">{i.roomId}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-zinc-900 dark:text-zinc-200">
                                {toUiStatus(i.status)}
                              </div>
                            </td>
                            <td className="px-4 py-4 text-slate-700 dark:text-zinc-300">
                              {new Date(i.createdAt).toLocaleString()}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex justify-end gap-2">
                                <Link
                                  href={`/dashboard/interviews/${i.roomId}`}
                                  className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                                >
                                  View
                                </Link>
                                <Link
                                  href={`/room/${i.roomId}`}
                                  className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                                >
                                  Open
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-3 md:hidden">
                    {interviews.map((i) => (
                      <div
                        key={String(i._id)}
                        className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50 dark:bg-zinc-950 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                              {i.title || "Interview"}
                            </div>
                            <div className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                              Room: <span className="font-mono">{i.roomId}</span>
                            </div>
                          </div>
                          <div className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-zinc-900 dark:text-zinc-200">
                            {toUiStatus(i.status)}
                          </div>
                        </div>
                        <div className="mt-3 text-xs text-slate-500 dark:text-zinc-500">
                          {new Date(i.createdAt).toLocaleString()}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Link
                            href={`/dashboard/interviews/${i.roomId}`}
                            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                          >
                            View
                          </Link>
                          <Link
                            href={`/room/${i.roomId}`}
                            className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                          >
                            Open
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Access control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-600 dark:text-zinc-400">
                - Admin / Interviewer can access the dashboard and create new rooms.
                <br />
                - Candidates can join only via a room link.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
