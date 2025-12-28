import * as React from "react";

import { cn } from "@/lib/utils";

type InputProps = React.ComponentPropsWithoutRef<"input">;

type TextareaProps = React.ComponentPropsWithoutRef<"textarea">;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-xl bg-white px-3 text-sm text-slate-900 ring-1 ring-slate-200 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-400 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-600",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-xl bg-white px-3 py-3 text-sm text-slate-900 ring-1 ring-slate-200 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-400 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-600",
        className
      )}
      {...props}
    />
  );
}
