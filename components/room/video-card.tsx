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
    return {
      path: "/api/peerjs",
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

function ControlButton({
  active,
  ariaLabel,
  onClick,
  activeClassName,
  inactiveClassName,
  children,
}: {
  active: boolean;
  ariaLabel: string;
  onClick: () => void;
  activeClassName: string;
  inactiveClassName: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition-colors",
        active ? activeClassName : inactiveClassName
      )}
    >
      {children}
    </button>
  );
}

function MicIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <path d="M12 19v4" />
      <path d="M8 23h8" />
    </svg>
  );
}

function MicOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 10v2a7 7 0 0 1-1.07 3.7" />
      <path d="M5 10v2a7 7 0 0 0 10 6" />
      <path d="M12 19v4" />
      <path d="M8 23h8" />
      <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
      <path d="M15 9V4a3 3 0 0 0-5.71-1.4" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 6.5h1.3a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6.2a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h1.3" />
      <path d="M9 6.5l1.2-2h3.6l1.2 2" />
      <path d="M12 10a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  );
}

function CameraOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 2l20 20" />
      <path d="M10.2 4.5h3.6l.8 1.3" />
      <path d="M18 10.2V17a2 2 0 0 1-2 2H6.2a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h2.2" />
      <path d="M14.5 6.5h1.3a2 2 0 0 1 2 2v2.8" />
      <path d="M11.2 11.2a3 3 0 0 0 3.6 3.6" />
    </svg>
  );
}

function ScreenShareIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9" />
      <path d="M4 14V6a2 2 0 0 1 2-2" />
      {active ? (
        <path d="M8 21l-4-4 4-4" />
      ) : (
        <path d="M4 17l4-4 4 4" />
      )}
      <path d="M8 13v8" />
    </svg>
  );
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
  const [isScreenSharing, setIsScreenSharing] = React.useState(false);
  const [presenterPeerId, setPresenterPeerId] = React.useState<string | null>(null);
  const [localScreenStream, setLocalScreenStream] = React.useState<MediaStream | null>(null);

  const cameraVideoRef = React.useRef<HTMLVideoElement | null>(null);
  const localStreamRef = React.useRef<MediaStream | null>(null);
  const screenStreamRef = React.useRef<MediaStream | null>(null);
  const cameraTrackRef = React.useRef<MediaStreamTrack | null>(null);
  const isScreenSharingRef = React.useRef(false);
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

  const replaceOutgoingVideoTrack = React.useCallback((track: MediaStreamTrack | null) => {
    connectionsRef.current.forEach((c) => {
      const pc = (c as unknown as { peerConnection?: RTCPeerConnection }).peerConnection;
      if (!pc) return;
      const sender = pc.getSenders().find((s) => s.track?.kind === "video");
      sender?.replaceTrack(track).catch(() => undefined);
    });
  }, []);

  const setCameraPreviewStream = React.useCallback((stream: MediaStream | null) => {
    const el = cameraVideoRef.current;
    if (!el) return;
    el.srcObject = stream;
    if (!stream) return;
    el.onloadedmetadata = () => {
      el.play().catch(() => undefined);
    };
  }, []);

  const getOutgoingStream = React.useCallback((): MediaStream | null => {
    const baseStream = localStreamRef.current;
    if (!baseStream) return null;

    if (isScreenSharingRef.current) {
      const displayTrack = screenStreamRef.current?.getVideoTracks()[0] || null;
      if (displayTrack) {
        return new MediaStream([displayTrack, ...baseStream.getAudioTracks()]);
      }
    }

    return baseStream;
  }, []);

  const stopScreenShare = React.useCallback(() => {
    const screenStream = screenStreamRef.current;
    if (screenStream) {
      screenStream.getTracks().forEach((t) => t.stop());
    }
    screenStreamRef.current = null;
    setIsScreenSharing(false);
    isScreenSharingRef.current = false;
    setLocalScreenStream(null);

    if (peerId) {
      setPresenterPeerId((current) => (current === peerId ? null : current));
    }

    if (socket && peerId) {
      socket.emit("webrtc:screen-share-stop", { roomId, peerId });
    }

    const cameraTrack = cameraTrackRef.current;
    if (cameraTrack) {
      cameraTrack.enabled = camEnabled;
      replaceOutgoingVideoTrack(cameraTrack);
    } else {
      replaceOutgoingVideoTrack(null);
    }

    setCameraPreviewStream(localStreamRef.current);
  }, [camEnabled, peerId, replaceOutgoingVideoTrack, roomId, setCameraPreviewStream, socket]);

  React.useEffect(() => {
    isScreenSharingRef.current = isScreenSharing;
  }, [isScreenSharing]);

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
        const audioTrack = stream.getAudioTracks()[0] || null;
        const videoTrack = stream.getVideoTracks()[0] || null;
        cameraTrackRef.current = videoTrack;
        if (audioTrack) audioTrack.enabled = true;
        if (videoTrack) videoTrack.enabled = true;

        setCameraPreviewStream(stream);

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
      screenStreamRef.current?.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
      localStreamRef.current?.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    };
  }, [setCameraPreviewStream]);

  // Boot socket + peer
  React.useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      setError(null);
      setStatus("Connecting...");

      try {
        await fetch("/api/socket");
        const peerConfig = getPeerConfig();
        if (peerConfig.path === "/api/peerjs") {
          await fetch("/api/peerjs");
        }

        const s = io({ path: "/api/socketio" });
        console.log("PeerJS config:", peerConfig);
        const p = new Peer(peerConfig);

        s.on("webrtc:screen-share", (payload: { peerId?: string; active?: boolean }) => {
          if (!mounted) return;
          const pid = typeof payload?.peerId === "string" ? payload.peerId : null;
          const active = payload?.active === true;
          if (!pid) return;

          setPresenterPeerId((current) => {
            if (!active && current === pid) return null;
            if (active) return pid;
            return current;
          });
        });

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
          const anyErr = err as unknown as { type?: unknown; message?: unknown };
          const type = typeof anyErr?.type === "string" ? anyErr.type : null;
          const message = typeof anyErr?.message === "string" ? anyErr.message : null;
          setError(type ? `PeerJS error: ${type}` : message ? `PeerJS error: ${message}` : "PeerJS error");
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

        p.on("call", (call) => {
          console.log("Incoming call from:", call.peer);
          const stream = getOutgoingStream();
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
          const stream = getOutgoingStream();
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
  }, [getOutgoingStream, registerRemoteStream, roomId, stopAll, unregisterRemoteStream, reconnectKey]);

  React.useEffect(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = micEnabled));
  }, [micEnabled]);

  React.useEffect(() => {
    if (isScreenSharing) {
      const screenTrack = screenStreamRef.current?.getVideoTracks()[0];
      if (screenTrack) screenTrack.enabled = camEnabled;
      return;
    }

    const cameraTrack = cameraTrackRef.current;
    if (cameraTrack) cameraTrack.enabled = camEnabled;
  }, [camEnabled, isScreenSharing]);

  const toggleScreenShare = React.useCallback(async () => {
    setError(null);
    if (isScreenSharing) {
      stopScreenShare();
      return;
    }

    try {
      const baseStream = localStreamRef.current;
      if (!baseStream) {
        setError("Local media not ready yet");
        return;
      }

      const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
      const displayTrack = displayStream.getVideoTracks()[0] || null;
      if (!displayTrack) {
        displayStream.getTracks().forEach((t) => t.stop());
        setError("Screen share not available");
        return;
      }

      screenStreamRef.current = displayStream;
      setIsScreenSharing(true);
      isScreenSharingRef.current = true;
      setLocalScreenStream(displayStream);

      if (peerId) {
        setPresenterPeerId(peerId);
      }

      if (socket && peerId) {
        socket.emit("webrtc:screen-share-start", { roomId, peerId });
      }
      displayTrack.enabled = camEnabled;
      replaceOutgoingVideoTrack(displayTrack);

      displayTrack.onended = () => {
        stopScreenShare();
      };
    } catch (err) {
      console.error("Screen share error:", err);
      setError("Screen share was blocked or cancelled");
      stopScreenShare();
    }
  }, [camEnabled, isScreenSharing, peerId, replaceOutgoingVideoTrack, roomId, socket, stopScreenShare]);

  const primaryRemote = React.useMemo(() => {
    if (!presenterPeerId) return remoteStreams[0] || null;
    if (presenterPeerId === peerId) return null;
    return remoteStreams.find((r) => r.id === presenterPeerId) || null;
  }, [peerId, presenterPeerId, remoteStreams]);

  const showLocalPresenting = presenterPeerId === peerId && !!localScreenStream;

  return (
    <Card className="animate-fade-in">
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
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="hover-lift lg:col-span-2 relative aspect-video overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
            {showLocalPresenting && localScreenStream ? (
              <RemoteVideo stream={localScreenStream} label="Presenting (You)" />
            ) : primaryRemote ? (
              <RemoteVideo
                stream={primaryRemote.stream}
                label={presenterPeerId ? `Presenting ${primaryRemote.id.slice(0, 6)}` : "Remote"}
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-slate-600 dark:text-zinc-400">
                Waiting for remote video…
              </div>
            )}
          </div>

          <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200 dark:bg-zinc-900 dark:ring-zinc-800">
            <video
              ref={cameraVideoRef}
              muted
              playsInline
              className={cn("h-full w-full object-cover", !camEnabled && "opacity-30")}
              style={{ transform: "scaleX(-1)" }}
            />
            <div className="absolute left-3 top-3 rounded-full bg-black/60 px-2 py-1 text-xs font-medium text-white">
              You
            </div>
          </div>
        </div>

        {remoteStreams.length > 0 ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {remoteStreams
              .filter((r) => (primaryRemote ? r.id !== primaryRemote.id : true))
              .map((r) => (
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
          <ControlButton
            active={micEnabled}
            ariaLabel={micEnabled ? "Mute microphone" : "Unmute microphone"}
            onClick={() => setMicEnabled((v) => !v)}
            activeClassName="bg-white text-slate-900 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
            inactiveClassName="bg-rose-50 text-rose-800 ring-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900/60 dark:hover:bg-rose-950/60"
          >
            {micEnabled ? <MicIcon /> : <MicOffIcon />}
          </ControlButton>

          <ControlButton
            active={camEnabled}
            ariaLabel={camEnabled ? "Turn off camera" : "Turn on camera"}
            onClick={() => setCamEnabled((v) => !v)}
            activeClassName="bg-white text-slate-900 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
            inactiveClassName="bg-amber-50 text-amber-900 ring-amber-200 hover:bg-amber-100 dark:bg-amber-950/25 dark:text-amber-200 dark:ring-amber-900/60 dark:hover:bg-amber-950/35"
          >
            {camEnabled ? <CameraIcon /> : <CameraOffIcon />}
          </ControlButton>

          <ControlButton
            active={isScreenSharing}
            ariaLabel={isScreenSharing ? "Stop screen sharing" : "Start screen sharing"}
            onClick={toggleScreenShare}
            activeClassName="bg-slate-950 text-white ring-slate-900/20 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:ring-white/20 dark:hover:bg-slate-200"
            inactiveClassName="bg-white text-slate-900 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-800 dark:hover:bg-zinc-900"
          >
            <ScreenShareIcon active={isScreenSharing} />
          </ControlButton>

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
