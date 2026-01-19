"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

type TemplateProps = {
  children: React.ReactNode;
};

const phases = [
  { label: "BOOT", desc: "Initializing environment…" },
  { label: "LINK", desc: "Establishing secure connection…" },
  { label: "SYNC", desc: "Syncing user data…" },
  { label: "READY", desc: "Welcome to InterviewOS." },
];

export default function Template({ children }: TemplateProps) {
  // Temporarily disable preloader to fix loading issue
  return <div className="relative z-0">{children}</div>;
}

/* ---------------- PRELOADER ---------------- */

function Preloader({
  phase,
  index,
}: {
  phase: { label: string; desc: string };
  index: number;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#0f1011] px-6 py-8 md:px-12 md:py-12 text-zinc-50"
      exit={{
        y: "-100%",
        transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] },
      }}
    >
      {/* Noise */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-start text-xs font-mono uppercase tracking-widest text-zinc-500">
        <span>InterviewOS</span>
        <span>Session Init</span>
      </div>

      {/* CENTER */}
      <div className="flex flex-col items-center justify-center text-center">
        {/* Phase Code */}
        <motion.h1
          key={phase.label}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-[10vh] md:text-[18vh] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600"
        >
          {phase.label}
          <span className="text-zinc-600 ml-3">/{String(index + 1).padStart(2, "0")}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          key={phase.desc}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4 }}
          className="mt-6 text-sm md:text-base text-zinc-400"
        >
          {phase.desc}
        </motion.p>
      </div>

      {/* SIGNAL LINE */}
      <div className="w-full">
        <div className="flex justify-between text-[10px] font-mono uppercase text-zinc-600 mb-2">
          <span>System Signal</span>
          <span>Active</span>
        </div>
        <div className="relative h-[2px] bg-zinc-800 overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 w-[30%] bg-white"
            animate={{ x: ["-40%", "140%"] }}
            transition={{
              duration: 1.1,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>
      </div>

      {/* Shadow Curtain */}
      <motion.div
        className="fixed inset-0 z-[-1] bg-zinc-900"
        exit={{
          y: "-100%",
          transition: {
            duration: 0.9,
            delay: 0.1,
            ease: [0.76, 0, 0.24, 1],
          },
        }}
      />
    </motion.div>
  );
}
