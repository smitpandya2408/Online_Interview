"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";

function clamp01(value: number) {
    return Math.min(1, Math.max(0, value));
}

export default function Loading() {
    const reduceMotion = useReducedMotion();
    const [progress, setProgress] = React.useState(0.12);

    React.useEffect(() => {
        if (reduceMotion) return;

        const start = Date.now();
        const durationMs = 1600;

        const id = window.setInterval(() => {
            const t = clamp01((Date.now() - start) / durationMs);
            const eased = 1 - Math.pow(1 - t, 3);
            const next = 0.12 + eased * 0.78;
            setProgress(next);
        }, 30);

        return () => window.clearInterval(id);
    }, [reduceMotion]);

    return (
        <div className="relative min-h-dvh overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
            <motion.div
                className="pointer-events-none absolute inset-0 opacity-70 dark:opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                aria-hidden="true"
            >
                <motion.div
                    className="absolute -left-40 top-[-120px] h-[420px] w-[420px] rounded-full bg-gradient-to-br from-slate-200 via-white to-slate-100 blur-3xl dark:from-zinc-800 dark:via-zinc-950 dark:to-zinc-900"
                    animate={
                        reduceMotion
                            ? undefined
                            : {
                                y: [0, -14, 0],
                                x: [0, 12, 0],
                            }
                    }
                    transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -right-40 bottom-[-140px] h-[460px] w-[460px] rounded-full bg-gradient-to-br from-slate-100 via-white to-slate-200 blur-3xl dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-800"
                    animate={
                        reduceMotion
                            ? undefined
                            : {
                                y: [0, 16, 0],
                                x: [0, -10, 0],
                            }
                    }
                    transition={{ duration: 7.2, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            <div className="relative px-4 py-16 sm:px-8 lg:px-10 2xl:px-16">
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="inline-flex items-center gap-3"
                    >
                        <motion.div
                            className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm ring-1 ring-slate-900/10 dark:bg-white dark:text-slate-950"
                            animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
                            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="text-sm font-semibold">IO</span>
                        </motion.div>
                        <div className="text-left">
                            <div className="text-sm font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                                InterviewOS
                            </div>
                            <div className="text-xs text-slate-600 dark:text-zinc-400">
                                Loading your interview workspace
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="mt-10 w-full max-w-md"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200/70 ring-1 ring-slate-200 dark:bg-zinc-800/60 dark:ring-zinc-800">
                            <motion.div
                                className="absolute inset-y-0 left-0 rounded-full bg-slate-950 dark:bg-white"
                                initial={{ width: "12%" }}
                                animate={{ width: `${Math.round(progress * 100)}%` }}
                                transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeOut" }}
                            />
                            <div className="loader-bar absolute inset-0 opacity-60" aria-hidden="true" />
                        </div>

                        <div className="mt-3 text-xs text-slate-500 dark:text-zinc-500">
                            {Math.round(progress * 100)}%
                        </div>
                    </motion.div>

                    <motion.div
                        className="mt-8 grid w-full max-w-md gap-3"
                        initial="hidden"
                        animate="show"
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: reduceMotion
                                    ? { duration: 0 }
                                    : { staggerChildren: 0.08, delayChildren: 0.18 },
                            },
                        }}
                    >
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <motion.div
                                key={idx}
                                variants={{
                                    hidden: { opacity: 0, y: 10 },
                                    show: { opacity: 1, y: 0 },
                                }}
                                className="h-12 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800"
                            >
                                <div className="loader-bar h-full w-full" aria-hidden="true" />
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div
                        className="mt-10 text-xs text-slate-500 dark:text-zinc-500"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        Secure rooms · Real-time collaboration · Structured evaluation
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
