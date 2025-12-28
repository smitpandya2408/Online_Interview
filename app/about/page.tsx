import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
    return (
        <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
            <SiteHeader className="sticky top-0 z-10 border-b border-transparent backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-950/40" />

            <main className="w-full px-4 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-10 2xl:px-16">
                <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
                    <div>
                        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-950 dark:bg-white" />
                            About
                        </div>
                        <h1 className="anim-delay-100 animate-fade-up mt-5 text-4xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50 sm:text-5xl">
                            A platform built around real interview operations.
                        </h1>
                        <p className="anim-delay-200 animate-fade-up mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-zinc-400 sm:text-lg">
                            InterviewOS is designed to help teams run structured, repeatable interviews—reducing bias, improving signal, and giving candidates a professional experience.
                        </p>

                        <div className="anim-delay-300 animate-fade-up mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Link href="/features" className={buttonClasses({ size: "lg" })}>
                                Explore features
                            </Link>
                            <Link href="/contact" className={buttonClasses({ variant: "secondary", size: "lg" })}>
                                Contact
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 -z-10 rounded-[28px] bg-gradient-to-br from-slate-200 via-white to-slate-100 blur-2xl dark:from-zinc-800 dark:via-zinc-950 dark:to-zinc-900" />
                        <Card className="animate-fade-in hover-lift rounded-[28px]">
                            <CardHeader>
                                <CardTitle>Our principles</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <img
                                    className="hover-lift aspect-[16/9] w-full rounded-2xl bg-slate-100 object-cover ring-1 ring-slate-200 grayscale dark:bg-zinc-900 dark:ring-zinc-800"
                                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1400&q=60"
                                    alt="Team interview operations"
                                    loading="lazy"
                                />
                                <div className="mt-4 grid gap-3">
                                    {[
                                        {
                                            title: "Consistency",
                                            desc: "Structured workflows so every interviewer follows the same process.",
                                        },
                                        {
                                            title: "Signal",
                                            desc: "Tools that help capture high-quality evidence for decisions.",
                                        },
                                        {
                                            title: "Candidate-first",
                                            desc: "A clean experience that feels respectful and professional.",
                                        },
                                        {
                                            title: "Security",
                                            desc: "Access control and privacy as core product values.",
                                        },
                                    ].map((p) => (
                                        <div key={p.title} className="hover-lift rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                                            <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">{p.title}</div>
                                            <div className="mt-1 text-sm leading-6 text-slate-600 dark:text-zinc-400">{p.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                <section className="mt-12 grid gap-4 lg:grid-cols-3">
                    {[
                        {
                            title: "Hiring leaders",
                            desc: "Standardize interviewing across teams with shared patterns, evaluation, and reporting.",
                        },
                        {
                            title: "Engineering",
                            desc: "Run technical interviews with a clean room experience and real-time collaboration.",
                        },
                        {
                            title: "Recruiting",
                            desc: "Reduce scheduling friction and improve candidate experience with consistent flows.",
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
            </main>

            <SiteFooter />
        </div>
    );
}
