import Link from "next/link";

import { cn } from "@/lib/utils";

type SiteFooterProps = {
    className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
    return (
        <footer className={cn("border-t border-slate-200 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-500", className)}>
            <div className="animate-fade-in w-full px-4 py-10 sm:px-8 lg:px-10 2xl:px-16">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">InterviewOS</div>
                        <div className="mt-2 text-sm leading-6">
                            A professional online interview platform with secure rooms, real-time collaboration, and structured evaluation.
                        </div>
                        <div className="mt-4 text-xs">© {new Date().getFullYear()} InterviewOS</div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Product</div>
                        <div className="mt-3 grid gap-2">
                            <Link href="/features" className="text-sm hover:text-slate-950 dark:hover:text-white hover:underline underline-offset-4">
                                Features
                            </Link>
                            <Link href="/security" className="text-sm hover:text-slate-950 dark:hover:text-white hover:underline underline-offset-4">
                                Security
                            </Link>
                            <Link href="/pricing" className="text-sm hover:text-slate-950 dark:hover:text-white hover:underline underline-offset-4">
                                Pricing
                            </Link>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Company</div>
                        <div className="mt-3 grid gap-2">
                            <Link href="/about" className="text-sm hover:text-slate-950 dark:hover:text-white hover:underline underline-offset-4">
                                About
                            </Link>
                            <Link href="/contact" className="text-sm hover:text-slate-950 dark:hover:text-white hover:underline underline-offset-4">
                                Contact
                            </Link>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Get started</div>
                        <div className="mt-3 grid gap-2">
                            <Link href="/create" className="text-sm hover:text-slate-950 dark:hover:text-white hover:underline underline-offset-4">
                                Create room
                            </Link>
                            <Link href="/join" className="text-sm hover:text-slate-950 dark:hover:text-white hover:underline underline-offset-4">
                                Join room
                            </Link>
                            <Link href="/dashboard" className="text-sm hover:text-slate-950 dark:hover:text-white hover:underline underline-offset-4">
                                Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-xs dark:border-zinc-800">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>Built with Next.js and Tailwind.</div>
                        <div className="text-slate-400 dark:text-zinc-600">Privacy • Terms • Status</div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
