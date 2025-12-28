import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SecurityPage() {
    return (
        <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
            <SiteHeader className="sticky top-0 z-10 border-b border-transparent backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-950/40" />

            <main className="w-full px-4 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-10 2xl:px-16">
                <section>
                    <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-950 dark:bg-white" />
                        Security
                    </div>
                    <h1 className="anim-delay-100 animate-fade-up mt-5 text-4xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50 sm:text-5xl">
                        Security-first by design.
                    </h1>
                    <p className="anim-delay-200 animate-fade-up mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-zinc-400 sm:text-lg">
                        InterviewOS is designed for professional hiring workflows—privacy, access control, and audit-friendly behavior are core product values.
                    </p>
                </section>

                <section className="anim-delay-300 animate-fade-up mt-8 overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                    <div className="grid gap-0 lg:grid-cols-2">
                        <div className="p-6 sm:p-8">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Security posture</div>
                            <div className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                                Safe defaults, clear controls, audit-friendly outcomes.
                            </div>
                            <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                                Build confidence with controlled access, room-scoped collaboration, and structured notes/ratings.
                            </div>
                            <div className="mt-5 grid gap-2">
                                {["Role-based dashboard access", "Room isolation by ID", "Structured evaluation + exports"].map((t) => (
                                    <div key={t} className="flex gap-2 text-sm text-slate-700 dark:text-zinc-300">
                                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950 dark:bg-white" />
                                        <span>{t}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <img
                                className="h-full w-full object-cover grayscale"
                                src="https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1600&q=60"
                                alt="Security and operations"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-transparent dark:from-zinc-950/70" />
                        </div>
                    </div>
                </section>

                <section className="mt-10 grid gap-4 lg:grid-cols-3">
                    {[
                        {
                            title: "Access control",
                            desc: "Admins and interviewers manage rooms; candidates join via link. Server-side session checks protect the dashboard.",
                        },
                        {
                            title: "Room isolation",
                            desc: "Rooms are identified by unique IDs. Events and connections are scoped to a room.",
                        },
                        {
                            title: "Data hygiene",
                            desc: "Structured notes and ratings are stored with an audit-friendly model. Export flows can be built on top.",
                        },
                        {
                            title: "Secure defaults",
                            desc: "Dark/light theme, careful UI, and predictable workflows reduce errors in high-stakes interviews.",
                        },
                        {
                            title: "Production hardening",
                            desc: "SSO, audit logs, retention policies, and admin controls can be added for enterprise deployments.",
                        },
                        {
                            title: "Operational visibility",
                            desc: "Dashboard views and status filters help teams detect issues and keep processes consistent.",
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

                <section className="mt-12 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-8">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">Security FAQ</h2>
                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        {[
                            {
                                q: "Is the dashboard protected?",
                                a: "Yes. Server-side session checks ensure only admins/interviewers can access dashboard routes.",
                            },
                            {
                                q: "Can candidates access admin pages?",
                                a: "No. Candidates only join a room via a link and cannot access admin-only routes.",
                            },
                            {
                                q: "Do you support enterprise compliance?",
                                a: "The product can be extended with SSO, audit logs, retention policies, and reporting as needed.",
                            },
                            {
                                q: "How do you handle room access?",
                                a: "Rooms are scoped by ID and can support scheduled start times and explicit access policies.",
                            },
                        ].map((item) => (
                            <div key={item.q} className="hover-lift rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">{item.q}</div>
                                <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">{item.a}</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Link href="/contact" className={buttonClasses({ size: "lg" })}>
                            Contact
                        </Link>
                        <Link href="/pricing" className={buttonClasses({ variant: "secondary", size: "lg" })}>
                            View pricing
                        </Link>
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
