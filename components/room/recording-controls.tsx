"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RecordingControlsProps = {
  roomId: string;
  isAdmin?: boolean;
};

function canRecord(role: unknown) {
  return role === "admin" || role === "interviewer";
}

function RecordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  );
}

function RecordingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
      <span className="text-sm text-red-600 dark:text-red-400">Recording</span>
    </div>
  );
}

export function RecordingControls({ roomId }: RecordingControlsProps) {
  const { data: session } = useSession();
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const userRole = session?.user?.role;
  const canUserRecord = canRecord(userRole);
  
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const startTimeRef = React.useRef<number>(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const isRecordingRef = React.useRef(false);

  React.useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = React.useCallback(async () => {
    try {
      setError(null);
      
      // Request screen recording permission
      let screenStream: MediaStream;
      try {
        screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
      } catch (err) {
        setError('Screen recording permission denied. Please allow screen access.');
        return;
      }

      // Get microphone audio for narration
      let audioStream: MediaStream | null = null;
      try {
        audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
          }
        });
      } catch (err) {
        console.warn('Microphone access denied, recording without audio');
      }

      // Combine screen and audio streams
      const combinedStream = new MediaStream();
      
      // Add video tracks from screen
      screenStream.getVideoTracks().forEach(track => {
        combinedStream.addTrack(track);
      });
      
      // Add audio tracks
      if (audioStream) {
        audioStream.getAudioTracks().forEach(track => {
          combinedStream.addTrack(track);
        });
      } else {
        // Try to get audio from screen stream if available
        screenStream.getAudioTracks().forEach(track => {
          combinedStream.addTrack(track);
        });
      }

      // Handle screen sharing end
      screenStream.getVideoTracks()[0].addEventListener('ended', () => {
        if (isRecordingRef.current) {
          stopRecording();
        }
      });
      
      const pickMimeType = () => {
        const candidates = [
          "video/webm;codecs=vp9",
          "video/webm;codecs=vp8", 
          "video/webm",
        ];
        for (const type of candidates) {
          if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
            return type;
          }
        }
        return undefined;
      };

      const mimeType = pickMimeType();

      // Create MediaRecorder with combined stream
      const mediaRecorder = mimeType
        ? new MediaRecorder(combinedStream, { mimeType })
        : new MediaRecorder(combinedStream);

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        screenStream.getTracks().forEach(track => track.stop());
        if (audioStream) {
          audioStream.getTracks().forEach(track => track.stop());
        }
        
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        if (!blob.size) {
          setError("Recording produced no data. Please try again.");
          return;
        }
        await uploadRecording(blob);
      };

      isRecordingRef.current = true;
      setIsRecording(true);
      mediaRecorder.start(1000); // Collect data every second
      
    } catch (err) {
      console.error('Recording error:', err);
      setError('Failed to start recording');
    }
  }, [roomId]);

  const stopRecording = React.useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      isRecordingRef.current = false;
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const uploadRecording = async (blob: Blob) => {
    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('video', blob, `recording-${roomId}-${Date.now()}.webm`);
      formData.append('roomId', roomId);
      formData.append('recordedBy', userRole as string || 'admin');

      const response = await fetch('/api/recordings', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let message = "Upload failed";
        try {
          const data = await response.json();
          if (data?.error) message = String(data.error);
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const result = await response.json();
      console.log('Recording uploaded successfully:', result);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload recording');
    } finally {
      setIsUploading(false);
    }
  };

  if (!canUserRecord) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recording Controls
          {isRecording && <RecordingIndicator />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isUploading}
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 transition-colors",
              isRecording
                ? "bg-red-500 text-white ring-red-600 hover:bg-red-600"
                : "bg-slate-900 text-white ring-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:ring-white dark:hover:bg-slate-200",
              (isUploading) && "opacity-50 cursor-not-allowed"
            )}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
          >
            {isRecording ? <StopIcon /> : <RecordIcon />}
          </button>
          
          <div className="text-sm">
            {isRecording ? (
              <span className="font-mono text-red-600 dark:text-red-400">
                {formatTime(recordingTime)}
              </span>
            ) : (
              <span className="text-slate-600 dark:text-zinc-400">
                Click to start recording
              </span>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="mt-3 text-sm text-blue-600 dark:text-blue-400">
            Uploading recording...
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900/60">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
