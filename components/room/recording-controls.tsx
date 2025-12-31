"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type RecordingControlsProps = {
  roomId: string;
  isAdmin?: boolean;
};

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

export function RecordingControls({ roomId, isAdmin = false }: RecordingControlsProps) {
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const chunksRef = React.useRef<Blob[]>([]);
  const startTimeRef = React.useRef<number>(0);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);

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
      
      // Get all video elements and cast them properly
      const videoElements = Array.from(document.querySelectorAll('video')) as HTMLVideoElement[];
      if (videoElements.length === 0) {
        setError('No video streams available to record');
        return;
      }

      // Create a canvas to combine video streams
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Failed to initialize recording canvas');
        return;
      }

      // Set canvas size for landscape recording
      canvas.width = 1280;
      canvas.height = 720;

      // Create a stream from the canvas
      const stream = canvas.captureStream(30); // 30 FPS
      
      // Add audio from the first available video stream
      let audioTrack: MediaStreamTrack | null = null;
      for (const video of videoElements) {
        const mediaStream = video.srcObject as MediaStream;
        if (mediaStream) {
          const audioTracks = mediaStream.getAudioTracks();
          if (audioTracks.length > 0) {
            audioTrack = audioTracks[0];
            break;
          }
        }
      }
      
      if (audioTrack) {
        stream.addTrack(audioTrack);
      }
      
      // Draw frames to canvas
      const drawFrame = () => {
        if (!isRecording) return;
        
        // Clear canvas
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Layout: Main video takes 2/3 width, local video takes 1/3
        const mainWidth = canvas.width * 0.67;
        const mainHeight = canvas.height;
        const localWidth = canvas.width * 0.33;
        const localHeight = canvas.height * 0.33;
        
        // Find the main remote video (first video that's not the local one)
        let mainVideo: HTMLVideoElement | null = null;
        let localVideo: HTMLVideoElement | null = null;
        
        videoElements.forEach((video: HTMLVideoElement) => {
          // Check if this is the local video (usually has muted attribute)
          if (video.muted && video.classList.contains('object-cover')) {
            localVideo = video;
          } else if (!mainVideo && (video as any).readyState >= 2) {
            mainVideo = video;
          }
        });
        
        // If no remote video, use local video as main
        if (!mainVideo && localVideo) {
          mainVideo = localVideo;
          localVideo = null;
        }
        
        // Draw main video
        if (mainVideo && (mainVideo as any).readyState >= 2) {
          ctx.drawImage(mainVideo, 0, 0, mainWidth, mainHeight);
        } else {
          // Placeholder for main video
          ctx.fillStyle = '#475569';
          ctx.fillRect(0, 0, mainWidth, mainHeight);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Main Video', mainWidth / 2, mainHeight / 2);
        }
        
        // Draw local video in corner
        if (localVideo && (localVideo as any).readyState >= 2) {
          const localX = canvas.width - localWidth - 20;
          const localY = canvas.height - localHeight - 20;
          
          // Add border around local video
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.strokeRect(localX - 2, localY - 2, localWidth + 4, localHeight + 4);
          
          ctx.drawImage(localVideo, localX, localY, localWidth, localHeight);
        } else if (localVideo) {
          // Placeholder for local video
          const localX = canvas.width - localWidth - 20;
          const localY = canvas.height - localHeight - 20;
          
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(localX, localY, localWidth, localHeight);
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 3;
          ctx.strokeRect(localX - 2, localY - 2, localWidth + 4, localHeight + 4);
          
          ctx.fillStyle = '#94a3b8';
          ctx.font = '16px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('You', localX + localWidth / 2, localY + localHeight / 2);
        }
        
        // Add timestamp
        const now = new Date();
        const timestamp = now.toLocaleTimeString();
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(timestamp, 10, 25);
        
        // Add recording indicator
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(canvas.width - 20, 20, 6, 0, 2 * Math.PI);
        ctx.fill();
        
        requestAnimationFrame(drawFrame);
      };
      
      drawFrame();

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        await uploadRecording(blob);
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      
    } catch (err) {
      console.error('Recording error:', err);
      setError('Failed to start recording');
    }
  }, [roomId]);

  const stopRecording = React.useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
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
      formData.append('recordedBy', 'admin');

      const response = await fetch('/api/recordings', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Recording uploaded successfully:', result);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload recording');
    } finally {
      setIsUploading(false);
    }
  };

  if (!isAdmin) {
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
