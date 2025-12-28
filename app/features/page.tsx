import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FeaturesPage() {
    return (
        <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
            <SiteHeader className="sticky top-0 z-10 border-b border-transparent backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-950/40" />

            <main className="w-full px-4 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-10 2xl:px-16">
                <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
                    <div>
                        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-950 dark:bg-white" />
                            Product features
                        </div>
                        <h1 className="anim-delay-100 animate-fade-up mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-slate-950 dark:text-zinc-50 sm:text-5xl">
                            Everything you need to run consistent, high-signal interviews.
                        </h1>
                        <p className="anim-delay-200 animate-fade-up mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-zinc-400 sm:text-lg">
                            InterviewOS combines video, collaborative coding, and structured evaluation into one room—so every interviewer follows the same workflow.
                        </p>

                        <div className="anim-delay-300 animate-fade-up mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link href="/create" className={buttonClasses({ size: "lg" })}>
                                Create a room
                            </Link>
                            <Link href="/pricing" className={buttonClasses({ variant: "secondary", size: "lg" })}>
                                View pricing
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-slate-200 via-white to-slate-100 blur-2xl dark:from-zinc-800 dark:via-zinc-950 dark:to-zinc-900" />
                        <Card className="animate-fade-in hover-lift rounded-[28px]">
                            <CardHeader>
                                <CardTitle>What’s inside a room</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img
                                    className="hover-lift aspect-[16/9] w-full rounded-2xl bg-slate-100 object-cover ring-1 ring-slate-200 grayscale dark:bg-zinc-900 dark:ring-zinc-800"
                                    src="https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1400&q=60"
                                    alt="Interview workflow"
                                    loading="lazy"
                                />
                                <div className="mt-4 grid gap-3">
                                    {[
                                        { title: "Video + audio", desc: "Low-friction calls built for interviews." },
                                        { title: "Screen sharing", desc: "Walk through architecture, debug, and review code." },
                                        { title: "Collaborative coding", desc: "Real-time editor for problem solving." },
                                        { title: "Notes + rating", desc: "Score consistently and capture decisions." },
                                        { title: "Exportable report", desc: "Share outcomes with hiring managers." },
                                    ].map((item) => (
                                        <div
                                            key={item.title}
                                            className="hover-lift rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800"
                                        >
                                            <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">{item.title}</div>
                                            <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">{item.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            title: "Interview scheduling",
                            desc: "Create rooms instantly or schedule for later to control early joins and reduce confusion.",
                        },
                        {
                            title: "Role-based access",
                            desc: "Admins and interviewers manage rooms; candidates join only via room link.",
                        },
                        {
                            title: "Audit-friendly workflow",
                            desc: "Store structured notes, ratings, and timestamps for review and compliance.",
                        },
                        {
                            title: "Candidate experience",
                            desc: "A clean, modern interface that feels professional and consistent.",
                        },
                        {
                            title: "Team operations",
                            desc: "Dashboard views for status filters, progress, and centralized tracking.",
                        },
                        {
                            title: "Extensible",
                            desc: "Designed to add templates, rubrics, and integrations as you scale.",
                        },
                    ].map((item) => (
                        <Card key={item.title} className="hover-lift transition-shadow hover:shadow-sm">
                            <CardHeader>
                                <CardTitle>{item.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm leading-6 text-slate-600 dark:text-zinc-400">{item.desc}</div>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="mt-12 overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">Run your next interview with a stronger signal.</h2>
                            <p className="mt-2 max-w-2xl text-sm text-white/70">
                                Standardize rooms, reduce friction, and ship faster hiring decisions.
                            </p>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/create"
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-slate-950 shadow-sm"
                            >
                                Create Room
                            </Link>
                            <Link
                                href="/contact"
                                className="inline-flex h-12 items-center justify-center rounded-2xl bg-white/10 px-5 text-sm font-semibold text-white ring-1 ring-white/20 hover:bg-white/15"
                            >
                                Talk to us
                            </Link>
                        </div>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
