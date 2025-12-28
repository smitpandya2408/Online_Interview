"use client";

import * as React from "react";

import Editor from "@monaco-editor/react";
import { io, type Socket } from "socket.io-client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SupportedLanguage = "javascript" | "python";

type EditorCardProps = {
  roomId: string;
  initialCode?: string;
  initialLanguage?: SupportedLanguage;
  readOnly?: boolean;
};

const templates: Record<SupportedLanguage, string> = {
  javascript:
    "// JavaScript\n\nfunction twoSum(nums, target) {\n  // TODO\n}\n",
  python:
    "# Python\n\ndef two_sum(nums, target):\n    # TODO\n    pass\n",
};

function createClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `client_${Math.random().toString(16).slice(2)}`;
}

export function EditorCard({
  roomId,
  initialCode = "",
  initialLanguage = "javascript",
  readOnly = false,
}: EditorCardProps) {
  const clientIdRef = React.useRef<string>(createClientId());
  const socketRef = React.useRef<Socket | null>(null);
  const sendTimerRef = React.useRef<number | null>(null);

  const [language, setLanguage] = React.useState<SupportedLanguage>(initialLanguage);
  const [code, setCode] = React.useState<string>(initialCode);
  const [status, setStatus] = React.useState<string>("Connecting...");
  const [error, setError] = React.useState<string | null>(null);

  const pushUpdate = React.useCallback(
    (nextCode: string, nextLanguage: SupportedLanguage) => {
      const s = socketRef.current;
      if (!s || !s.connected) return;
      s.emit("code:update", {
        roomId,
        code: nextCode,
        language: nextLanguage,
        clientId: clientIdRef.current,
      });
    },
    [roomId]
  );

  const scheduleUpdate = React.useCallback(
    (nextCode: string, nextLanguage: SupportedLanguage) => {
      if (sendTimerRef.current) {
        window.clearTimeout(sendTimerRef.current);
      }
      sendTimerRef.current = window.setTimeout(() => {
        pushUpdate(nextCode, nextLanguage);
      }, 150);
    },
    [pushUpdate]
  );

  React.useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      setError(null);
      setStatus("Connecting...");

      try {
        await fetch("/api/socket");

        const s = io({
          path: "/api/socketio",
        });

        socketRef.current = s;

        s.on("connect", () => {
          if (!mounted) return;
          setStatus("Connected");
          s.emit("code:join", { roomId, clientId: clientIdRef.current });
        });

        s.on("connect_error", () => {
          if (!mounted) return;
          setError("Editor sync connection failed");
          setStatus("Offline");
        });

        s.on("disconnect", () => {
          if (!mounted) return;
          setStatus("Reconnecting...");
        });

        s.on(
          "code:state",
          (payload: {
            roomId: string;
            code: string;
            language: SupportedLanguage;
            clientId?: string;
          }) => {
            if (!mounted) return;
            if (!payload || payload.roomId !== roomId) return;
            setLanguage(payload.language === "python" ? "python" : "javascript");
            setCode(typeof payload.code === "string" ? payload.code : "");
          }
        );

        s.on(
          "code:update",
          (payload: {
            roomId: string;
            code: string;
            language: SupportedLanguage;
            clientId?: string;
          }) => {
            if (!mounted) return;
            if (!payload || payload.roomId !== roomId) return;
            if (payload.clientId && payload.clientId === clientIdRef.current) return;

            setLanguage(payload.language === "python" ? "python" : "javascript");
            setCode(typeof payload.code === "string" ? payload.code : "");
          }
        );
      } catch {
        if (!mounted) return;
        setError("Failed to initialize editor sync");
        setStatus("Offline");
      }
    }

    bootstrap();

    return () => {
      mounted = false;
      if (sendTimerRef.current) {
        window.clearTimeout(sendTimerRef.current);
      }
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [roomId]);

  function onChangeCode(next: string | undefined) {
    if (readOnly) return;
    const safe = typeof next === "string" ? next : "";
    setCode(safe);
    scheduleUpdate(safe, language);
  }

  function onChangeLanguage(next: SupportedLanguage) {
    if (readOnly) return;
    setLanguage(next);
    scheduleUpdate(code, next);
  }

  function onReset() {
    if (readOnly) return;
    const next = templates[language];
    setCode(next);
    scheduleUpdate(next, language);
  }

  function onClear() {
    if (readOnly) return;
    setCode("");
    scheduleUpdate("", language);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Code Editor</CardTitle>
            <div className="mt-1 text-xs text-slate-500 dark:text-zinc-500">
              {status}
              {readOnly ? " • Read-only" : ""}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={language}
              onChange={(e) => onChangeLanguage(e.target.value as SupportedLanguage)}
              disabled={readOnly}
              className={cn(
                "h-10 rounded-xl bg-white px-3 text-sm font-medium text-slate-900 ring-1 ring-slate-200 outline-none",
                "focus:ring-2 focus:ring-slate-400",
                "disabled:opacity-50",
                "dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:focus:ring-zinc-600"
              )}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>

            <button
              type="button"
              onClick={onReset}
              disabled={readOnly}
              className="h-10 rounded-xl bg-white px-4 text-sm font-medium text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClear}
              disabled={readOnly}
              className="h-10 rounded-xl bg-white px-4 text-sm font-medium text-slate-900 ring-1 ring-slate-200 transition-colors hover:bg-slate-50 disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
            >
              Clear
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200 dark:ring-zinc-800">
          <Editor
            height={420}
            theme="vs-dark"
            language={language === "python" ? "python" : "javascript"}
            value={code}
            onChange={onChangeCode}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              scrollBeyondLastLine: false,
              wordWrap: "on",
              readOnly,
            }}
          />
        </div>

        {error ? (
          <div className="mt-4 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900/60">
            {error}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
