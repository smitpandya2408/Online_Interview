"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";

// --- Utility: Random number for organic counter ---
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min);

type TemplateProps = {
  children: React.ReactNode;
};

export default function Template({ children }: TemplateProps) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [count, setCount] = React.useState(0);

  // 1. Counter Logic
  React.useEffect(() => {
    // Only run on client mount
    if (typeof window === "undefined") return;

    // Prevent scrolling while loading
    document.body.style.overflow = "hidden";

    const duration = 2500; // Total load time in ms
    const intervalTime = 20;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      
      // Calculate non-linear progress (starts fast, slows down at end)
      const progress = easeOutCubic(currentStep / steps);
      const newCount = Math.min(Math.round(progress * 100), 100);

      setCount(newCount);

      if (currentStep >= steps) {
        clearInterval(timer);
        // Small delay at 100% before lifting the curtain
        setTimeout(() => {
            setIsLoading(false);
            document.body.style.overflow = "";
        }, 400);
      }
    }, intervalTime);

    return () => {
      clearInterval(timer);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <Preloader count={count} />}
      </AnimatePresence>
      
      {/* Content wrapper */}
      <div className="relative z-0">
          {children}
      </div>
    </>
  );
}

// --- Easing function for the counter ---
function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

// --- The Main Loading Component ---
function Preloader({ count }: { count: number }) {
    // Dynamic messages based on percentage
    const currentMessage = React.useMemo(() => {
        if (count < 30) return "Initializing environment...";
        if (count < 60) return "Establishing secure connection...";
        if (count < 90) return "Syncing user data...";
        return "Welcome to InterviewOS.";
    }, [count]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#0f1011] px-4 py-8 md:px-12 md:py-12 text-zinc-50"
            exit={{ 
                y: "-100%", 
                transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } // Custom Bezier for "Shutter" effect
            }}
        >
            {/* Background Noise Texture for premium feel */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
            />

            {/* Top Section: Logo / Header */}
            <div className="w-full flex justify-between items-start opacity-0 animate-fade-in-down" style={{ animationFillMode: 'forwards', animationDelay: '0.2s' }}>
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-white rounded-full animate-pulse" />
                    <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">InterviewOS</span>
                </div>
                <div className="hidden md:block text-xs font-mono text-zinc-600">
                    System v2.4.0
                </div>
            </div>

            {/* Middle Section: Big Counter & Message */}
            <div className="relative w-full max-w-4xl flex flex-col items-center justify-center">
                {/* The Huge Counter */}
                <div className="relative">
                    <motion.h1 
                        className="text-[12vh] leading-[0.9] md:text-[22vh] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {count}%
                    </motion.h1>
                    
                    {/* Decorative Ring */}
                    <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-20 animate-spin-slow" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                    </svg>
                </div>

                {/* Status Message with Slide Up Animation */}
                <div className="h-8 overflow-hidden mt-8 text-center">
                    <motion.p 
                        key={currentMessage} // Key change triggers animation
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.35 }}
                        className="text-sm md:text-base font-medium text-zinc-400"
                    >
                        {currentMessage}
                    </motion.p>
                </div>
            </div>

            {/* Bottom Section: Progress Bar */}
            <div className="w-full flex flex-col gap-2">
                <div className="flex justify-between text-[10px] uppercase font-mono text-zinc-500">
                    <span>Loading Assets</span>
                    <span>{count}/100</span>
                </div>
                <div className="h-[2px] w-full bg-zinc-800 relative overflow-hidden">
                    <motion.div 
                        className="absolute top-0 left-0 h-full bg-white"
                        initial={{ width: "0%" }}
                        animate={{ width: `${count}%` }}
                        transition={{ ease: "linear", duration: 0.2 }} // Smooth update
                    />
                </div>
            </div>
            
            {/* Secondary Layer for Parallax Exit Effect (The "Shadow" curtain) */}
            <motion.div 
                className="fixed inset-0 z-[-1] bg-zinc-900"
                initial={{ y: 0 }}
                exit={{ 
                    y: "-100%", 
                    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 } // Starts slightly later
                }} 
            />
        </motion.div>
    );
}