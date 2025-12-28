import * as React from "react";

import { cn } from "@/lib/utils";

type DivProps = React.ComponentPropsWithoutRef<"div">;

type HeadingProps = React.ComponentPropsWithoutRef<"h3">;

type ParagraphProps = React.ComponentPropsWithoutRef<"p">;

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 dark:bg-zinc-950 dark:ring-zinc-800",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: HeadingProps) {
  return (
    <h3
      className={cn(
        "text-base font-semibold tracking-tight text-slate-900 dark:text-zinc-50",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: ParagraphProps) {
  return (
    <p
      className={cn("mt-1 text-sm text-slate-600 dark:text-zinc-400", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cn("px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: DivProps) {
  return <div className={cn("px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props} />;
}
