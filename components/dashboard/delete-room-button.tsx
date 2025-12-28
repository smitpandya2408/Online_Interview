"use client";

import * as React from "react";

import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

type DeleteRoomButtonProps = {
    roomId: string;
    className?: string;
    variant?: "table" | "header";
    onDeletedHref?: string;
};

export function DeleteRoomButton({
    roomId,
    className,
    variant = "table",
    onDeletedHref,
}: DeleteRoomButtonProps) {
    const router = useRouter();
    const [state, setState] = React.useState<"idle" | "deleting" | "error">("idle");
    const [error, setError] = React.useState<string | null>(null);

    async function handleDelete() {
        if (!roomId) return;

        const ok = window.confirm("Delete this room? This will remove interview data, chat, and code snapshots.");
        if (!ok) return;

        setState("deleting");
        setError(null);

        try {
            const res = await fetch(`/api/rooms/${roomId}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed");

            if (onDeletedHref) {
                router.push(onDeletedHref);
            } else {
                router.refresh();
            }
        } catch {
            setState("error");
            setError("Could not delete room");
        }
    }

    const isDeleting = state === "deleting";

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <button
                type="button"
                disabled={isDeleting}
                onClick={() => void handleDelete()}
                className={cn(
                    variant === "header"
                        ? "h-10 rounded-xl px-4 text-sm font-medium ring-1 transition-colors"
                        : "rounded-xl px-3 py-2 text-sm font-medium ring-1 transition-colors",
                    isDeleting
                        ? "cursor-not-allowed bg-slate-100 text-slate-400 ring-slate-200 dark:bg-zinc-900 dark:text-zinc-500 dark:ring-zinc-800"
                        : "bg-rose-50 text-rose-800 ring-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900/60 dark:hover:bg-rose-950/60"
                )}
            >
                {isDeleting ? "Deleting..." : "Delete"}
            </button>

            {error ? <div className="text-xs font-medium text-rose-700 dark:text-rose-200">{error}</div> : null}
        </div>
    );
}
