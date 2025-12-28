"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type TemplateProps = {
    children: React.ReactNode;
};

export default function Template({ children }: TemplateProps) {
    const reduceMotion = useReducedMotion();
    const [showFirstLoad, setShowFirstLoad] = React.useState(false);

    const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];
    const springSoft = reduceMotion
        ? undefined
        : {
            type: "spring" as const,
            stiffness: 160,
            damping: 18,
            mass: 0.9,
        };

    React.useEffect(() => {
        setShowFirstLoad(true);
    }, []);

    React.useEffect(() => {
        if (!showFirstLoad) return;
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = previous;
        };
    }, [showFirstLoad]);

    React.useEffect(() => {
        if (!showFirstLoad) return;
        const id = window.setTimeout(() => {
            setShowFirstLoad(false);
        }, 2000);
        return () => window.clearTimeout(id);
    }, [showFirstLoad]);

    return (
        <>
            <AnimatePresence>
                {showFirstLoad ? (
                    <motion.div
                        key="first-load-overlay"
                        className="fixed inset-0 z-[9999] overflow-hidden bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900"
                        initial={{ opacity: 1 }}
                        exit={
                            reduceMotion
                                ? { opacity: 0 }
                                : {
                                    opacity: 0,
                                    filter: "blur(10px)",
                                    transform: "scale(1.02)",
                                    transition: { duration: 0.55, ease: easeOutExpo },
                                }
                        }
                    >
                        <div className="absolute inset-0">
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

                            <motion.div
                                className="absolute inset-0 opacity-[0.10] dark:opacity-[0.08]"
                                animate={reduceMotion ? undefined : { opacity: [0.07, 0.12, 0.07] }}
                                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
                                style={{
                                    backgroundImage:
                                        "radial-gradient(circle at 20% 10%, rgba(15,23,42,0.22), transparent 55%), radial-gradient(circle at 80% 70%, rgba(15,23,42,0.18), transparent 55%)",
                                }}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="relative flex min-h-dvh items-center justify-center px-4 sm:px-8 lg:px-10 2xl:px-16">
                            <div className="w-full max-w-md">
                                <motion.div
                                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 14, scale: 0.96 }}
                                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
                                    transition={springSoft ?? { duration: 0.55, ease: easeOutExpo }}
                                    className="relative mx-auto grid h-16 w-16 place-items-center"
                                >
                                    <motion.div
                                        className="absolute inset-0 rounded-[22px]"
                                        animate={
                                            reduceMotion
                                                ? undefined
                                                : {
                                                    rotate: 360,
                                                }
                                        }
                                        transition={{ duration: 7.5, repeat: Infinity, ease: "linear" }}
                                        style={{
                                            background:
                                                "conic-gradient(from 90deg, rgba(15,23,42,0.00), rgba(15,23,42,0.40), rgba(15,23,42,0.00))",
                                            filter: "blur(0.2px)",
                                        }}
                                        aria-hidden="true"
                                    />
                                    <div className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-2xl bg-slate-950 text-white shadow-sm ring-1 ring-slate-900/10 dark:bg-white dark:text-slate-950">
                                        <motion.div
                                            className="pointer-events-none absolute inset-0 opacity-50"
                                            animate={
                                                reduceMotion
                                                    ? undefined
                                                    : {
                                                        x: ["-120%", "140%"],
                                                    }
                                            }
                                            transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
                                            style={{
                                                background:
                                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
                                            }}
                                            aria-hidden="true"
                                        />
                                        <span className="relative text-sm font-semibold">IO</span>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="mt-5 text-center"
                                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                    transition={{ delay: 0.06, duration: 0.6, ease: easeOutExpo }}
                                >
                                    <div className="text-sm font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
                                        <span className="relative inline-block">
                                            InterviewOS
                                            <motion.span
                                                className="pointer-events-none absolute inset-y-0 -left-10 w-10 opacity-40"
                                                animate={
                                                    reduceMotion
                                                        ? undefined
                                                        : {
                                                            x: [0, 240],
                                                        }
                                                }
                                                transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.35 }}
                                                style={{
                                                    background:
                                                        "linear-gradient(90deg, transparent, rgba(15,23,42,0.20), transparent)",
                                                }}
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </div>
                                    <div className="mt-2 text-xs text-slate-600 dark:text-zinc-400">
                                        Preparing your workspace…
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="mt-8"
                                    initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                                    animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                                    transition={{ delay: 0.12, duration: 0.6, ease: easeOutExpo }}
                                >
                                    <div className="loader-bar h-2 w-full rounded-full bg-slate-200/70 ring-1 ring-slate-200 dark:bg-zinc-800/60 dark:ring-zinc-800" />

                                    <motion.div
                                        className="mt-6 grid gap-3"
                                        initial="hidden"
                                        animate="show"
                                        variants={{
                                            hidden: { opacity: 0 },
                                            show: {
                                                opacity: 1,
                                                transition: reduceMotion
                                                    ? { duration: 0 }
                                                    : { staggerChildren: 0.08, delayChildren: 0.05 },
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
                                                className="loader-bar h-12 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800"
                                                aria-hidden="true"
                                            />
                                        ))}
                                    </motion.div>

                                    <motion.div
                                        className="mt-6 flex items-center justify-center gap-2 text-[11px] font-medium text-slate-500 dark:text-zinc-500"
                                        initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
                                        animate={reduceMotion ? { opacity: 1 } : { opacity: 1 }}
                                        transition={{ delay: 0.22, duration: 0.5, ease: easeOutExpo }}
                                    >
                                        <motion.span
                                            className="h-1.5 w-1.5 rounded-full bg-slate-400/70 dark:bg-zinc-500/70"
                                            animate={reduceMotion ? undefined : { scale: [1, 1.35, 1] }}
                                            transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                        <span>Secure rooms</span>
                                        <span className="opacity-40">•</span>
                                        <span>Real-time collaboration</span>
                                        <span className="opacity-40">•</span>
                                        <span>Reports</span>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            <div className="page-transition">{children}</div>
        </>
    );
}
