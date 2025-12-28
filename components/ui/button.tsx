import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-slate-600";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-900 text-white shadow-sm hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200",
  secondary:
    "bg-white text-slate-900 ring-1 ring-slate-200 shadow-sm hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900",
  ghost:
    "bg-transparent text-slate-900 hover:bg-slate-100 dark:text-zinc-50 dark:hover:bg-zinc-900",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

type ButtonClassOptions = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: ButtonClassOptions = {}) {
  return cn(baseClasses, variantClasses[variant], sizeClasses[size], className);
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses({ variant, size, className })}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
