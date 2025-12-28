"use client";

import * as React from "react";

import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Button, buttonClasses } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";

export default function ContactPage() {
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [message, setMessage] = React.useState("");

    function onSubmit(e: React.FormEvent) {
        e.preventDefault();
    }

    return (
        <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
            <SiteHeader className="sticky top-0 z-10 border-b border-transparent backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-950/40" />

            <main className="w-full px-4 pb-16 pt-10 sm:px-8 sm:pt-14 lg:px-10 2xl:px-16">
                <section className="grid gap-10 lg:grid-cols-2 lg:items-start">
                    <div>
                        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800">
                            <span className="h-1.5 w-1.5 rounded-full bg-slate-950 dark:bg-white" />
                            Contact
                        </div>
                        <h1 className="anim-delay-100 animate-fade-up mt-5 text-4xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50 sm:text-5xl">
                            Talk to the team.
                        </h1>
                        <p className="anim-delay-200 animate-fade-up mt-4 max-w-xl text-base leading-7 text-slate-600 dark:text-zinc-400 sm:text-lg">
                            Questions about workflows, security, or integrations? Send a message and we’ll respond.
                        </p>

                        <div className="anim-delay-300 animate-fade-up mt-8 grid gap-3">
                            <img
                                className="hover-lift aspect-[16/9] w-full rounded-2xl bg-slate-100 object-cover ring-1 ring-slate-200 grayscale dark:bg-zinc-900 dark:ring-zinc-800"
                                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=60"
                                alt="Team support"
                                loading="lazy"
                            />
                            <div className="hover-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Email</div>
                                <div className="mt-2 text-sm font-semibold text-slate-900 dark:text-zinc-50">hello@interviewos.dev</div>
                            </div>
                            <div className="hover-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Docs</div>
                                <Link href="/features" className="mt-2 inline-flex text-sm font-semibold text-slate-900 hover:underline dark:text-zinc-50">
                                    Product overview
                                </Link>
                            </div>
                            <div className="hover-lift rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800">
                                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Security</div>
                                <Link href="/security" className="mt-2 inline-flex text-sm font-semibold text-slate-900 hover:underline dark:text-zinc-50">
                                    Security details
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Card className="animate-fade-in hover-lift rounded-[28px]">
                        <CardHeader>
                            <CardTitle>Send a message</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmit} className="grid gap-4">
                                <label className="grid gap-2">
                                    <span className="text-sm font-medium text-slate-900 dark:text-zinc-50">Name</span>
                                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                                </label>
                                <label className="grid gap-2">
                                    <span className="text-sm font-medium text-slate-900 dark:text-zinc-50">Email</span>
                                    <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
                                </label>
                                <label className="grid gap-2">
                                    <span className="text-sm font-medium text-slate-900 dark:text-zinc-50">Message</span>
                                    <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder="How can we help?" />
                                </label>

                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <Button type="submit">Send</Button>
                                    <Link href="/create" className={buttonClasses({ variant: "secondary" })}>
                                        Or create a room
                                    </Link>
                                </div>

                                <div className="text-xs text-slate-500 dark:text-zinc-500">
                                    This form is UI-only right now. Wire it to an API when you’re ready.
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}
