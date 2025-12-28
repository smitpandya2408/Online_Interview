import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { buttonClasses } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Tier = {
    name: string;
    price: string;
    desc: string;
    features: string[];
    cta: { label: string; href: string; variant?: "primary" | "secondary" };
    highlight?: boolean;
};

const tiers: Tier[] = [
    {
        name: "Starter",
        price: "Free",
        desc: "For small teams testing a better interview workflow.",
        features: ["Unlimited rooms", "Basic dashboard", "Video + mic controls", "Notes + rating"],
        cta: { label: "Create room", href: "/create" },
    },
    {
        name: "Team",
        price: "$29 / interviewer",
        desc: "For structured interviewing across multiple interviewers.",
        features: [
            "Scheduling controls",
            "Advanced dashboards",
            "Exportable reports",
            "Shared rubrics (coming soon)",
        ],
        cta: { label: "Get started", href: "/create" },
        highlight: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        desc: "For security, compliance, and large-scale hiring.",
        features: ["SSO (coming soon)", "Audit logs (coming soon)", "Dedicated support", "Custom SLAs"],
        cta: { label: "Contact sales", href: "/contact", variant: "secondary" },
    },
];

export default function PricingPage() {
    return (
        <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
            <SiteHeader className="sticky top-0 z-10 border-b border-transparent backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-950/40" />

            <main className="w-full px-4 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-10 2xl:px-16">
                <section>
                    <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-slate-950 dark:bg-white" />
                        Pricing
                    </div>
                    <h1 className="anim-delay-100 animate-fade-up mt-5 text-4xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50 sm:text-5xl">
                        Pricing that scales from solo interviews to enterprise hiring.
                    </h1>
                    <p className="anim-delay-200 animate-fade-up mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-zinc-400 sm:text-lg">
                        Start free, upgrade when you need deeper analytics, scheduling policies, and support.
                    </p>
                </section>

                <section className="anim-delay-300 animate-fade-up mt-8 overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                    <div className="grid gap-0 lg:grid-cols-2">
                        <div className="p-6 sm:p-8">
                            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Value</div>
                            <div className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                                Built for operational hiring—not generic meetings.
                            </div>
                            <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">
                                Keep interviews consistent with a focused room layout, structured evaluation, and dashboard visibility.
                            </div>
                            <div className="mt-5 grid gap-2">
                                {["Room scheduling controls", "Reports + export", "Team dashboard"].map((t) => (
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
                                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=60"
                                alt="Team planning"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-white/70 to-transparent dark:from-zinc-950/70" />
                        </div>
                    </div>
                </section>

                <section className="mt-10 grid gap-4 lg:grid-cols-3">
                    {tiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={
                                tier.highlight
                                    ? "hover-lift relative overflow-hidden ring-2 ring-slate-950 dark:ring-white"
                                    : "hover-lift transition-shadow hover:shadow-sm"
                            }
                        >
                            <CardHeader>
                                <CardTitle className="flex items-center justify-between">
                                    <span>{tier.name}</span>
                                    {tier.highlight ? (
                                        <span className="rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-semibold text-white dark:bg-white dark:text-slate-950">
                                            Popular
                                        </span>
                                    ) : null}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">{tier.price}</div>
                                <div className="mt-2 text-sm text-slate-600 dark:text-zinc-400">{tier.desc}</div>

                                <div className="mt-5 grid gap-2">
                                    {tier.features.map((f) => (
                                        <div key={f} className="flex gap-2 text-sm text-slate-700 dark:text-zinc-300">
                                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-950 dark:bg-white" />
                                            <span>{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6">
                                    <Link
                                        href={tier.cta.href}
                                        className={
                                            tier.cta.variant === "secondary"
                                                ? buttonClasses({ variant: "secondary", size: "lg" })
                                                : buttonClasses({ size: "lg" })
                                        }
                                    >
                                        {tier.cta.label}
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                <section className="mt-12 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800 sm:p-8">
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">FAQ</h2>
                    <div className="mt-6 grid gap-4 lg:grid-cols-2">
                        {[
                            {
                                q: "Do candidates need an account?",
                                a: "No. Candidates can join with a room link. Access control can be expanded further for enterprise workflows.",
                            },
                            {
                                q: "Can I schedule interviews?",
                                a: "Yes. You can create rooms instantly or set them for future time windows to prevent early joins.",
                            },
                            {
                                q: "Do you support exports?",
                                a: "You can export interview reports for sharing with hiring managers and keeping an audit trail.",
                            },
                            {
                                q: "What about SSO and audit logs?",
                                a: "Those are typically enterprise requirements and can be added based on your team’s needs.",
                            },
                        ].map((item) => (
                            <div key={item.q} className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800">
                                <div className="text-sm font-semibold text-slate-900 dark:text-zinc-50">{item.q}</div>
                                <div className="mt-2 text-sm leading-6 text-slate-600 dark:text-zinc-400">{item.a}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
