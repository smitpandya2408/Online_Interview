import Link from "next/link";

import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/site/theme-toggle";

type SiteHeaderProps = {
  className?: string;
};

export function SiteHeader({ className }: SiteHeaderProps) {
  return (
    <header className={cn("w-full", className)}>
      <div className="animate-fade-in flex w-full items-center justify-between px-4 py-5 sm:px-8 lg:px-10 2xl:px-16">
        <Link href="/" className="group inline-flex items-center gap-2">
          <div className="hover-lift grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950">
            <span className="text-sm font-semibold">IO</span>
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">
              InterviewOS
            </div>
            <div className="text-xs text-slate-600 dark:text-zinc-400">Online Interview Platform</div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-2 sm:flex">
            <Link
              href="/features"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/security"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              Security
            </Link>

            <Link
              href="/create"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              Create
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/join"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              Join
            </Link>

            <Link
              href="/about"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-white"
            >
              Contact
            </Link>
          </nav>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
