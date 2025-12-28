import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";
import { buttonClasses } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
      <SiteHeader className="sticky top-0 z-10 border-b border-transparent backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-950/40" />

      <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Company-ready interview rooms
            </div>

            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-zinc-50 sm:text-5xl">
              Online interviews, built for real hiring workflows.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-zinc-400 sm:text-lg">
              Create secure interview rooms with video, collaborative coding, and structured notes.
              Designed for speed, consistency, and a professional candidate experience.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/create"
                className={buttonClasses({ size: "lg" })}
                aria-label="Create interview room"
              >
                Create Interview Room
              </Link>
              <Link
                href="/join"
                className={buttonClasses({ variant: "secondary", size: "lg" })}
                aria-label="Join interview room"
              >
                Join Interview Room
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                  Live video + audio
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Stable calls, low friction, and a clean candidate view.
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                  Collaborative coding
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  A shared editor for real-time problem solving.
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                  Structured evaluation
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Notes and scoring built around consistent rubrics.
                </div>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                  Secure by default
                </div>
                <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                  Room IDs, access control, and audit-friendly flows.
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-slate-200 via-white to-slate-100 blur-2xl dark:from-zinc-800 dark:via-zinc-950 dark:to-zinc-900" />
            <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
                    Interview Room Preview
                  </div>
                  <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                    Video + editor + notes in one place.
                  </div>
                </div>
                <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                  Prototype
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="aspect-video rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800" />
                <div className="aspect-video rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800" />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-100 p-4 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Collaborative Editor
                  </div>
                  <div className="text-xs text-slate-500 dark:text-zinc-500">Monaco (next step)</div>
                </div>
                <div className="mt-3 h-24 rounded-xl bg-white/80 dark:bg-zinc-950/60" />
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-14 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-500">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>© {new Date().getFullYear()} InterviewOS</div>
            <div className="text-xs">Built with Next.js, Tailwind, and modern real-time tech.</div>
          </div>
        </footer>
      </main>
    </div>
  );
}
