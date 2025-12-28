"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type RevealProps = {
    children: React.ReactNode;
    className?: string;
    delayMs?: number;
};

export function Reveal({ children, className, delayMs }: RevealProps) {
    const ref = React.useRef<HTMLDivElement | null>(null);
    const [visible, setVisible] = React.useState(false);

    React.useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={cn(visible ? "reveal-visible" : "reveal-hidden", className)}
            style={delayMs ? ({ animationDelay: `${delayMs}ms` } as React.CSSProperties) : undefined}
        >
            {children}
        </div>
    );
}
