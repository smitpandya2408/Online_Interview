import Link from "next/link";

import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  className?: string;
};

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header className={cn("w-full", className)}>
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950">
            <span className="text-sm font-semibold">IO</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
              InterviewOS
            </div>
            <div className="text-xs text-slate-600 dark:text-zinc-400">Online Interview Platform</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          <Link
            href="/create"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            Create
          </Link>
          <Link
            href="/join"
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
          >
            Join
          </Link>
        </nav>
      </div>
    </header>
  );
}
