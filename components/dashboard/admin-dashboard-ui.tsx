import Link from "next/link";

import { DeleteRoomButton } from "@/components/dashboard/delete-room-button";
import { ThemeToggle } from "@/components/site/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type SessionUser = {
    email?: string | null;
    name?: string | null;
};

type AdminDashboardUIProps = {
    user: SessionUser;
    interviews: any[];
    statusFilter: string;
    totalInterviews: number;
    scheduledCount: number;
    ongoingCount: number;
    completedCount: number;
    avgRating: number | null;
    ratedCount: number;
};

function toUiStatus(status: unknown) {
    if (status === "scheduled" || status === "ongoing" || status === "completed") return status;
    if (status === "created") return "scheduled";
    if (status === "started") return "ongoing";
    if (status === "ended") return "completed";
    return "scheduled";
}

function formatScheduledOrCreated(i: any) {
    const status = i?.status;
    const scheduledAt = i?.scheduledAt;
    if ((status === "scheduled" || status === "created") && scheduledAt) {
        const d = new Date(scheduledAt);
        if (!Number.isNaN(d.getTime())) {
            return `Scheduled: ${d.toLocaleString()}`;
        }
    }
    return new Date(i.createdAt).toLocaleString();
}

export function AdminDashboardUI({
    user,
    interviews,
    statusFilter,
    totalInterviews,
    scheduledCount,
    ongoingCount,
    completedCount,
    avgRating,
    ratedCount,
}: AdminDashboardUIProps) {
    const completionPercent = totalInterviews > 0 ? Math.round((completedCount / totalInterviews) * 100) : 0;
    const topRoomId = interviews[0]?.roomId ? String(interviews[0].roomId) : "";

    return (
        <div className="min-h-dvh bg-slate-50 text-slate-950 dark:bg-zinc-950 dark:text-zinc-50">
            <main className="w-full px-4 py-6 sm:px-8 lg:px-10 2xl:px-16">
                <div className="animate-fade-in rounded-[32px] bg-white shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                    <div className="flex flex-col gap-6 p-4 sm:p-6 lg:flex-row lg:gap-8">
                        <aside className="w-full shrink-0 lg:w-64">
                            <div className="rounded-[28px] bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2">
                                        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
                                            <span className="text-sm font-semibold">IO</span>
                                        </div>
                                        <div className="leading-tight">
                                            <div className="text-sm font-semibold">Dashboard</div>
                                            <div className="text-xs text-slate-500 dark:text-zinc-500">Admin</div>
                                        </div>
                                    </div>
                                    <div className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-slate-600 ring-1 ring-slate-200 dark:bg-zinc-950 dark:text-zinc-400 dark:ring-zinc-800">
                                        v1
                                    </div>
                                </div>

                                <div className="mt-5 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-zinc-500">
                                    Menu
                                </div>

                                <nav className="mt-3 grid gap-1">
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center justify-between rounded-2xl bg-slate-900/10 px-3 py-2 text-sm font-semibold text-slate-950 ring-1 ring-slate-900/15 dark:bg-white/5 dark:text-zinc-50 dark:ring-white/10"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span className="grid h-8 w-8 place-items-center rounded-xl bg-white text-slate-950 ring-1 ring-slate-200 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800">
                                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M3 3h8v8H3z" />
                                                    <path d="M13 3h8v5h-8z" />
                                                    <path d="M13 10h8v11h-8z" />
                                                    <path d="M3 13h8v8H3z" />
                                                </svg>
                                            </span>
                                            Dashboard
                                        </span>
                                        <span className="grid h-6 w-6 place-items-center rounded-lg bg-slate-950 text-xs font-semibold text-white dark:bg-white dark:text-slate-950">
                                            {scheduledCount}
                                        </span>
                                    </Link>

                                    <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white/70 dark:text-zinc-300 dark:hover:bg-zinc-950/40">
                                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M4 4h16v16H4z" />
                                                <path d="M4 9h16" />
                                                <path d="M9 4v16" />
                                            </svg>
                                        </span>
                                        Tasks
                                    </div>

                                    <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white/70 dark:text-zinc-300 dark:hover:bg-zinc-950/40">
                                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M8 2v4" />
                                                <path d="M16 2v4" />
                                                <path d="M3 10h18" />
                                                <path d="M5 6h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
                                            </svg>
                                        </span>
                                        Calendar
                                    </div>

                                    <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white/70 dark:text-zinc-300 dark:hover:bg-zinc-950/40">
                                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M3 3v18h18" />
                                                <path d="M7 15v-3" />
                                                <path d="M11 15V9" />
                                                <path d="M15 15v-6" />
                                                <path d="M19 15v-9" />
                                            </svg>
                                        </span>
                                        Analytics
                                    </div>

                                    <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white/70 dark:text-zinc-300 dark:hover:bg-zinc-950/40">
                                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                                <circle cx="8.5" cy="7" r="4" />
                                                <path d="M20 8v6" />
                                                <path d="M23 11h-6" />
                                            </svg>
                                        </span>
                                        Team
                                    </div>
                                </nav>

                                <div className="mt-6 text-[11px] font-semibold uppercase tracking-wide text-slate-400 dark:text-zinc-500">
                                    General
                                </div>

                                <div className="mt-3 grid gap-1">
                                    <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white/70 dark:text-zinc-300 dark:hover:bg-zinc-950/40">
                                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M12 1v2" />
                                                <path d="M12 21v2" />
                                                <path d="M4.22 4.22 5.64 5.64" />
                                                <path d="M18.36 18.36 19.78 19.78" />
                                                <path d="M1 12h2" />
                                                <path d="M21 12h2" />
                                                <path d="M4.22 19.78 5.64 18.36" />
                                                <path d="M18.36 5.64 19.78 4.22" />
                                                <circle cx="12" cy="12" r="4" />
                                            </svg>
                                        </span>
                                        Settings
                                    </div>
                                    <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white/70 dark:text-zinc-300 dark:hover:bg-zinc-950/40">
                                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="12" cy="12" r="10" />
                                                <path d="M12 16v-4" />
                                                <path d="M12 8h.01" />
                                            </svg>
                                        </span>
                                        Help
                                    </div>
                                    <div className="flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-medium text-slate-600 hover:bg-white/70 dark:text-zinc-300 dark:hover:bg-zinc-950/40">
                                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-white ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <path d="M16 17l5-5-5-5" />
                                                <path d="M21 12H9" />
                                            </svg>
                                        </span>
                                        Logout
                                    </div>
                                </div>

                                <div className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-4 text-white shadow-sm">
                                    <div className="text-sm font-semibold">Download Our Mobile App</div>
                                    <div className="mt-1 text-xs text-white/70">Interview on the go, manage rooms anywhere.</div>
                                    <button
                                        type="button"
                                        className="mt-4 inline-flex h-9 items-center rounded-xl bg-white/10 px-3 text-xs font-semibold ring-1 ring-white/20 hover:bg-white/15"
                                    >
                                        Download
                                    </button>
                                </div>
                            </div>
                        </aside>

                        <section className="min-w-0 flex-1">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex w-full items-center gap-3 sm:max-w-xl">
                                    <div className="relative w-full">
                                        <div className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-slate-400 dark:text-zinc-500">
                                            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <circle cx="11" cy="11" r="8" />
                                                <path d="m21 21-4.3-4.3" />
                                            </svg>
                                        </div>
                                        <Input placeholder="Search" className="h-11 rounded-2xl pl-10" />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        aria-label="Notifications"
                                        className="grid h-11 w-11 place-items-center rounded-2xl bg-white ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                                    >
                                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                        </svg>
                                    </button>

                                    <ThemeToggle />

                                    <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                                        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-200">
                                            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                        <div className="hidden sm:block">
                                            <div className="text-sm font-semibold">{user.name || "Admin"}</div>
                                            <div className="text-xs text-slate-500 dark:text-zinc-500">{user.email || ""}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="animate-fade-in rounded-[28px] bg-gradient-to-br from-slate-950 to-slate-800 p-5 text-white shadow-sm ring-1 ring-slate-900/40">
                                    <div className="text-sm font-semibold text-white/90">Total Projects</div>
                                    <div className="mt-3 text-4xl font-semibold tracking-tight">{totalInterviews}</div>
                                    <div className="mt-2 text-xs text-white/70">Interview rooms created.</div>
                                </div>

                                <Card className="hover-lift rounded-[28px]">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Ended Projects</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">{completedCount}</div>
                                        <div className="mt-2 text-xs text-slate-500 dark:text-zinc-500">Completed interviews.</div>
                                    </CardContent>
                                </Card>

                                <Card className="hover-lift rounded-[28px]">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Running Projects</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">{ongoingCount}</div>
                                        <div className="mt-2 text-xs text-slate-500 dark:text-zinc-500">Ongoing interviews.</div>
                                    </CardContent>
                                </Card>

                                <Card className="hover-lift rounded-[28px]">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm">Pending Project</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">{scheduledCount}</div>
                                        <div className="mt-2 text-xs text-slate-500 dark:text-zinc-500">Scheduled interviews.</div>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="mt-6 grid gap-4 lg:grid-cols-12">
                                <Card className="hover-lift rounded-[28px] lg:col-span-7">
                                    <CardHeader>
                                        <CardTitle>Team Collaboration</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4 flex flex-wrap items-center gap-2">
                                            <Link
                                                href="/dashboard"
                                                className={
                                                    statusFilter === "all"
                                                        ? "rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
                                                        : "rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                                                }
                                            >
                                                All
                                            </Link>
                                            <Link
                                                href="/dashboard?status=scheduled"
                                                className={
                                                    statusFilter === "scheduled"
                                                        ? "rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
                                                        : "rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                                                }
                                            >
                                                Scheduled
                                            </Link>
                                            <Link
                                                href="/dashboard?status=ongoing"
                                                className={
                                                    statusFilter === "ongoing"
                                                        ? "rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
                                                        : "rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                                                }
                                            >
                                                Ongoing
                                            </Link>
                                            <Link
                                                href="/dashboard?status=completed"
                                                className={
                                                    statusFilter === "completed"
                                                        ? "rounded-2xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
                                                        : "rounded-2xl bg-white px-3 py-2 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                                                }
                                            >
                                                Completed
                                            </Link>
                                        </div>

                                        {interviews.length === 0 ? (
                                            <div className="py-8 text-sm text-slate-600 dark:text-zinc-400">No interviews yet.</div>
                                        ) : (
                                            <div className="grid gap-3">
                                                {interviews.map((i) => (
                                                    <div
                                                        key={String(i._id)}
                                                        className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">{i.title || "Interview"}</div>
                                                                <div className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
                                                                    Room: <span className="font-mono">{i.roomId}</span>
                                                                </div>
                                                                <div className="mt-2 text-xs text-slate-500 dark:text-zinc-500">{formatScheduledOrCreated(i)}</div>
                                                            </div>
                                                            <div className="flex flex-col items-end gap-2">
                                                                <div className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700 dark:bg-zinc-900 dark:text-zinc-200">
                                                                    {toUiStatus(i.status)}
                                                                </div>
                                                                <div className="flex flex-wrap justify-end gap-2">
                                                                    <Link
                                                                        href={`/dashboard/interviews/${i.roomId}`}
                                                                        className="rounded-2xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                                                                    >
                                                                        View
                                                                    </Link>
                                                                    <Link
                                                                        href={`/room/${i.roomId}`}
                                                                        className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                                                                    >
                                                                        Open
                                                                    </Link>
                                                                    <DeleteRoomButton roomId={i.roomId} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card className="hover-lift rounded-[28px] lg:col-span-5">
                                    <CardHeader>
                                        <CardTitle>Project Progress</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center justify-center">
                                            <div className="relative grid h-44 w-44 place-items-center">
                                                <svg viewBox="0 0 36 36" className="h-44 w-44">
                                                    <path
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeOpacity="0.12"
                                                        strokeWidth="3"
                                                    />
                                                    <path
                                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        strokeDasharray={`${completionPercent}, 100`}
                                                        className="text-slate-950 dark:text-white"
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                                <div className="absolute">
                                                    <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">{completionPercent}%</div>
                                                    <div className="mt-1 text-xs text-slate-500 dark:text-zinc-500">Completion</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Rating Insights</div>
                                            <div className="mt-2 text-sm text-slate-700 dark:text-zinc-300">
                                                Average rating: <span className="font-semibold">{avgRating === null ? "—" : avgRating.toFixed(2)}</span>
                                            </div>
                                            <div className="mt-1 text-xs text-slate-500 dark:text-zinc-500">Based on {ratedCount} rated interviews</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
