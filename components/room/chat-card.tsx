"use client";

import * as React from "react";

import { io, type Socket } from "socket.io-client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  roomId: string;
  sender: string;
  text: string;
  createdAt: string;
};

type ChatCardProps = {
  roomId: string;
};

function safeTrim(s: string) {
  return s.trim().replace(/\s+/g, " ");
}

export function ChatCard({ roomId }: ChatCardProps) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [sender, setSender] = React.useState<string>("You");
  const [draft, setDraft] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isReady, setIsReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem("interviewos.sender");
      if (stored) setSender(stored);
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem("interviewos.sender", sender);
    } catch {
      // ignore
    }
  }, [sender]);

  React.useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      setError(null);
      setIsReady(false);

      try {
        // Ensure the Socket.io server is initialized.
        await fetch("/api/socket");

        // Load history from MongoDB.
        const historyRes = await fetch(`/api/rooms/${roomId}/messages`, {
          method: "GET",
        });
        const history = (await historyRes.json()) as { messages?: ChatMessage[] };
        if (mounted && Array.isArray(history.messages)) {
          setMessages(history.messages);
        }

        const s = io({
          path: "/api/socketio",
        });

        s.on("connect", () => {
          s.emit("room:join", roomId);
          if (mounted) setIsReady(true);
        });

        s.on("connect_error", () => {
          if (mounted) setError("Chat connection failed");
        });

        s.on("chat:message", (msg: ChatMessage) => {
          if (!mounted) return;
          if (!msg || msg.roomId !== roomId) return;

          setMessages((prev) => {
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
        });

        if (mounted) setSocket(s);
      } catch {
        if (mounted) setError("Failed to load chat");
      }
    }

    bootstrap();

    return () => {
      mounted = false;
      setIsReady(false);
      setSocket((s) => {
        s?.disconnect();
        return null;
      });
    };
  }, [roomId]);

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  function send() {
    const text = safeTrim(draft);
    const name = safeTrim(sender) || "You";
    if (!text) return;

    if (!socket || !socket.connected) {
      setError("Not connected");
      return;
    }

    socket.emit("chat:send", { roomId, sender: name, text });
    setDraft("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="grid gap-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
              Your name
            </div>
            <Input value={sender} onChange={(e) => setSender(e.target.value)} placeholder="e.g. Interviewer" />
          </div>

          <div
            ref={listRef}
            className="h-56 overflow-y-auto rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200 dark:bg-zinc-900/40 dark:ring-zinc-800"
          >
            {messages.length === 0 ? (
              <div className="text-sm text-slate-600 dark:text-zinc-400">
                No messages yet. Say hello.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {messages.map((m) => {
                  const mine = safeTrim(m.sender).toLowerCase() === safeTrim(sender).toLowerCase();
                  return (
                    <div
                      key={m.id}
                      className={cn("flex", mine ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ring-1",
                          mine
                            ? "bg-slate-900 text-white ring-slate-900 dark:bg-white dark:text-slate-950 dark:ring-white"
                            : "bg-white text-slate-900 ring-slate-200 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800"
                        )}
                      >
                        <div className={cn("text-[11px] font-semibold opacity-80", mine && "text-white/80 dark:text-slate-700")}>
                          {m.sender}
                        </div>
                        <div className="mt-0.5 whitespace-pre-wrap break-words">{m.text}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={isReady ? "Type a message..." : "Connecting..."}
              disabled={!isReady}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
            />
            <button
              type="button"
              onClick={send}
              disabled={!isReady}
              className="h-11 shrink-0 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              Send
            </button>
          </div>

          {error ? (
            <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900/60">
              {error}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
