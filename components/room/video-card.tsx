"use client";

import * as React from "react";

import Peer, { type MediaConnection } from "peerjs";
import { io, type Socket } from "socket.io-client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type VideoCardProps = {
  roomId: string;
};

function getPeerConfig() {
  // Use PeerJS Cloud for production
  const hostname = window.location.hostname;
  const isLocalDev = hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168");
  
  if (isLocalDev) {
    // Local development - use self-hosted
    const isHttps = window.location.protocol === "https:";
    const port = window.location.port ? Number(window.location.port) : undefined;
    return {
      host: hostname,
      port,
      path: "/api/peerjs",
      secure: isHttps,
    };
  } else {
    // Production - use PeerJS Cloud (free public server)
    console.log("Using PeerJS Cloud server for production");
    return {
      host: "0.peerjs.com",
      secure: true,
      port: 443,
    };
  }
}

export function VideoCard({ roomId }: VideoCardProps) {
  const [socket, setSocket] = React.useState<Socket | null>(null);
  const [peer, setPeer] = React.useState<Peer | null>(null);
  const [peerId, setPeerId] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<string>("Starting...");
  const [error, setError] = React.useState<string | null>(null);
  const [reconnectKey, setReconnectKey] = React.useState(0);

  const [micEnabled, setMicEnabled] = React.useState(true);
  const [camEnabled, setCamEnabled] = React.useState(true);

  const localVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const localStreamRef = React.useRef<MediaStream | null>(null);
  const selfPeerIdRef = React.useRef<string | null>(null);

  const connectionsRef = React.useRef<Map<string, MediaConnection>>(new Map());
  const remoteStreamsRef = React.useRef<Map<string, MediaStream>>(new Map());
  const [remoteStreams, setRemoteStreams] = React.useState<Array<{ id: string; stream: MediaStream }>>([]);

  const registerRemoteStream = React.useCallback((id: string, stream: MediaStream) => {
    remoteStreamsRef.current.set(id, stream);
    setRemoteStreams(Array.from(remoteStreamsRef.current.entries()).map(([pid, s]) => ({ id: pid, stream: s })));
  }, []);

  const unregisterRemoteStream = React.useCallback((id: string) => {
    remoteStreamsRef.current.delete(id);
    setRemoteStreams(Array.from(remoteStreamsRef.current.entries()).map(([pid, s]) => ({ id: pid, stream: s })));
  }, []);

  const stopAll = React.useCallback(() => {
    connectionsRef.current.forEach((c) => c.close());
    connectionsRef.current.clear();
    remoteStreamsRef.current.clear();
    setRemoteStreams([]);
  }, []);

  // Boot local media
  React.useEffect(() => {
    let cancelled = false;

    async function startMedia() {
      setError(null);
      try {
        // Try with specific constraints first, then fallback to basic
        let stream: MediaStream | null = null;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
          });
        } catch {
          // Fallback to basic constraints
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
        }

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        localStreamRef.current = stream;
        stream.getAudioTracks().forEach((t) => (t.enabled = true));
        stream.getVideoTracks().forEach((t) => (t.enabled = true));

        const el = localVideoRef.current;
        if (el) {
          el.srcObject = stream;
          el.onloadedmetadata = () => {
            el.play().catch(() => undefined);
          };
        }

        setStatus("Ready");
      } catch (err) {
        console.error("Media error:", err);
        setError("Camera/microphone permission denied or not available");
        setStatus("Blocked");
      }
    }

    startMedia();

    return () => {
      cancelled = true;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    };
  }, []);

  // Boot socket + peer
  React.useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      setError(null);
      setStatus("Connecting...");

      try {
        await fetch("/api/socket");
        // PeerJS now uses cloud server, no need to fetch endpoint

        const s = io({ path: "/api/socketio" });
        const peerConfig = getPeerConfig();
        console.log("PeerJS config:", peerConfig);
        const p = new Peer(peerConfig);

        p.on("open", (id) => {
          if (!mounted) return;
          console.log("PeerJS connected with ID:", id);
          setPeerId(id);
          selfPeerIdRef.current = id;
          s.emit("webrtc:register", { roomId, peerId: id });
          setStatus("Waiting for peer...");
        });

        p.on("error", (err) => {
          console.error("PeerJS error:", err);
          setError(`PeerJS error: ${err}`);
        });

        p.on("disconnected", () => {
          if (!mounted) return;
          console.log("PeerJS disconnected, reconnecting...");
          setStatus("Reconnecting...");
          setReconnectKey((k) => k + 1);
        });

        p.on("close", () => {
          if (!mounted) return;
          console.log("PeerJS connection closed");
        });
          if (!mounted) return;
          setStatus("Reconnecting...");
          setReconnectKey((k) => k + 1);
        });

        p.on("error", () => {
          if (!mounted) return;
          setError("Peer connection failed");
        });

        p.on("call", (call) => {
          console.log("Incoming call from:", call.peer);
          const stream = localStreamRef.current;
          if (!stream) {
            console.warn("No local stream available, closing call");
            call.close();
            return;
          }

          connectionsRef.current.set(call.peer, call);
          call.answer(stream);

          call.on("stream", (remoteStream) => {
            if (!mounted) return;
            console.log("Received remote stream from:", call.peer);
            registerRemoteStream(call.peer, remoteStream);
          });

          call.on("close", () => {
            console.log("Call closed with:", call.peer);
            connectionsRef.current.delete(call.peer);
            unregisterRemoteStream(call.peer);
          });

          call.on("error", (err) => {
            console.error("Call error with", call.peer, ":", err);
            connectionsRef.current.delete(call.peer);
            unregisterRemoteStream(call.peer);
          });
        });

        function callPeer(targetPeerId: string) {
          const stream = localStreamRef.current;
          if (!stream) {
            console.warn("No local stream, cannot call peer:", targetPeerId);
            return;
          }
          if (connectionsRef.current.has(targetPeerId)) {
            console.log("Already connected to peer:", targetPeerId);
            return;
          }
          if (targetPeerId === selfPeerIdRef.current) {
            console.log("Ignoring self peer");
            return;
          }

          console.log("Calling peer:", targetPeerId);
          const call = p.call(targetPeerId, stream);
          if (!call) {
            console.error("Failed to initiate call to:", targetPeerId);
            return;
          }

          connectionsRef.current.set(targetPeerId, call);
          call.on("stream", (remoteStream) => {
            if (!mounted) return;
            console.log("Got remote stream from outgoing call:", targetPeerId);
            registerRemoteStream(targetPeerId, remoteStream);
          });
          call.on("close", () => {
            console.log("Call closed (outgoing) with:", targetPeerId);
            connectionsRef.current.delete(targetPeerId);
            unregisterRemoteStream(targetPeerId);
          });
          call.on("error", (err) => {
            console.error("Outgoing call error with", targetPeerId, ":", err);
            connectionsRef.current.delete(targetPeerId);
            unregisterRemoteStream(targetPeerId);
          });
        }

        s.on("webrtc:peers", (peers: string[]) => {
          if (!mounted) return;
          peers.forEach((pid) => callPeer(pid));
          if (peers.length > 0) setStatus("Connected");
        });

        s.on("webrtc:peer-joined", (newPeerId: string) => {
          if (!mounted) return;
          callPeer(newPeerId);
          setStatus("Connected");
        });

        s.on("webrtc:peer-left", (leftPeerId: string) => {
          connectionsRef.current.get(leftPeerId)?.close();
          connectionsRef.current.delete(leftPeerId);
          unregisterRemoteStream(leftPeerId);
          if (remoteStreamsRef.current.size === 0) setStatus("Waiting for peer...");
        });

        s.on("connect_error", () => {
          if (!mounted) return;
          setError("Signaling server connection failed");
        });

        s.on("disconnect", () => {
          if (!mounted) return;
          setStatus("Reconnecting...");
          setReconnectKey((k) => k + 1);
        });

        if (mounted) {
          setSocket(s);
          setPeer(p);
        }
      } catch {
        if (!mounted) return;
        setError("Failed to start video call");
      }
    }

    bootstrap();

    return () => {
      mounted = false;
      stopAll();
      selfPeerIdRef.current = null;
      setSocket((s) => {
        s?.disconnect();
        return null;
      });
      setPeer((p) => {
        p?.destroy();
        return null;
      });
      setPeerId(null);
    };
  }, [registerRemoteStream, roomId, stopAll, unregisterRemoteStream, reconnectKey]);

  React.useEffect(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = micEnabled));
  }, [micEnabled]);

  React.useEffect(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = camEnabled));
  }, [camEnabled]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle>Video Call</CardTitle>
          <div className="text-right text-xs text-slate-500 dark:text-zinc-500">
            <div>{status}</div>
            {peerId ? <div className="font-mono">{peerId}</div> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <video
              ref={localVideoRef}
              muted
              playsInline
              className={cn("h-full w-full object-cover", !camEnabled && "opacity-30")}
            />
            <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
              You
            </div>
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
            {remoteStreams[0] ? (
              <RemoteVideo stream={remoteStreams[0].stream} label="Remote" />
            ) : (
              <div className="grid h-full place-items-center text-sm text-slate-600 dark:text-zinc-400">
                Waiting for remote video…
              </div>
            )}
          </div>
        </div>

        {remoteStreams.length > 1 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {remoteStreams.slice(1).map((r) => (
              <div
                key={r.id}
                className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800"
              >
                <RemoteVideo stream={r.stream} label={`Remote ${r.id.slice(0, 6)}`} />
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setMicEnabled((v) => !v)}
            className={cn(
              "h-10 rounded-xl px-4 text-sm font-medium ring-1 transition-colors",
              micEnabled
                ? "bg-white text-slate-900 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                : "bg-rose-50 text-rose-800 ring-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900/60 dark:hover:bg-rose-950/60"
            )}
          >
            {micEnabled ? "Mic: On" : "Mic: Off"}
          </button>

          <button
            type="button"
            onClick={() => setCamEnabled((v) => !v)}
            className={cn(
              "h-10 rounded-xl px-4 text-sm font-medium ring-1 transition-colors",
              camEnabled
                ? "bg-white text-slate-900 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                : "bg-amber-50 text-amber-900 ring-amber-200 hover:bg-amber-100 dark:bg-amber-950/25 dark:text-amber-200 dark:ring-amber-900/60 dark:hover:bg-amber-950/35"
            )}
          >
            {camEnabled ? "Camera: On" : "Camera: Off"}
          </button>

          <button
            type="button"
            onClick={() => {
              stopAll();
              setStatus("Reconnecting...");
              socket?.disconnect();
              peer?.destroy();
              setSocket(null);
              setPeer(null);
              selfPeerIdRef.current = null;
              setPeerId(null);
              setReconnectKey((k) => k + 1);
            }}
            className="h-10 rounded-xl bg-slate-900 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            Reconnect
          </button>
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

function RemoteVideo({ stream, label }: { stream: MediaStream; label: string }) {
  const ref = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.srcObject = stream;
    el.play().catch(() => undefined);
  }, [stream]);

  return (
    <>
      <video ref={ref} playsInline className="h-full w-full object-cover" />
      <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
        {label}
      </div>
    </>
  );
}
