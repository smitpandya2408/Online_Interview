"use client";

import * as React from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Recording = {
  roomId: string;
  title?: string;
  recordedAt?: string;
  duration?: number;
  recordedBy?: string;
  cloudinaryUrl?: string;
  cloudinaryPublicId?: string;
  createdAt: string;
  status: string;
  participants: {
    interviewer?: string;
    candidate?: string;
  };
};

export default function RecordingsPage() {
  const [recordings, setRecordings] = React.useState<Recording[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchRecordings();
  }, []);

  const fetchRecordings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/recordings/list');
      
      if (!response.ok) {
        throw new Error('Failed to fetch recordings');
      }
      
      const data = await response.json();
      setRecordings(data.recordings || []);
    } catch (err) {
      console.error('Error fetching recordings:', err);
      setError('Failed to load recordings');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
        <SiteHeader className="border-b border-transparent" />
        <main className="w-full px-4 py-8 sm:px-8 lg:px-10 2xl:px-16">
          <div className="text-center">Loading recordings...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gradient-to-b from-white to-slate-50 dark:from-zinc-950 dark:to-zinc-900">
      <SiteHeader className="border-b border-transparent" />

      <main className="w-full px-4 py-8 sm:px-8 lg:px-10 2xl:px-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-zinc-50">
              Meeting Recordings
            </h1>
            <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
              View and manage all recorded interviews
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
            >
              Home
            </Link>
            <Link
              href="/join"
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
            >
              Join Room
            </Link>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900/60">
            {error}
          </div>
        )}

        {recordings.length === 0 && !error ? (
          <div className="mt-6">
            <Card>
              <CardContent className="py-12 text-center">
                <div className="text-slate-600 dark:text-zinc-400">
                  No recordings found yet. Start a meeting and use the recording controls to create your first recording.
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {recordings.map((recording) => (
              <Card key={recording.roomId} className="hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">
                        {recording.title || `Interview ${recording.roomId}`}
                      </CardTitle>
                      <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                        Room ID: <span className="font-mono">{recording.roomId}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-500 dark:text-zinc-500">
                      <div>Duration: {formatDuration(recording.duration)}</div>
                      <div>By: {recording.recordedBy || 'Unknown'}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-zinc-50">
                        Recording Details
                      </div>
                      <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                        <div>Recorded: {formatDate(recording.recordedAt)}</div>
                        <div>Interview created: {formatDate(recording.createdAt)}</div>
                        <div>Status: {recording.status}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900 dark:text-zinc-50">
                        Participants
                      </div>
                      <div className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
                        <div>Interviewer: {recording.participants.interviewer || 'Not specified'}</div>
                        <div>Candidate: {recording.participants.candidate || 'Not specified'}</div>
                      </div>
                    </div>
                  </div>

                  {recording.cloudinaryUrl && (
                    <div className="mt-4">
                      <video
                        controls
                        className="w-full rounded-lg"
                        preload="metadata"
                      >
                        <source src={recording.cloudinaryUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}

                  <div className="mt-4 flex items-center gap-2">
                    <Link
                      href={`/room/${recording.roomId}`}
                      className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                    >
                      View Room
                    </Link>
                    {recording.cloudinaryUrl && (
                      <a
                        href={recording.cloudinaryUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-slate-50 dark:bg-zinc-950 dark:text-zinc-300 dark:ring-zinc-800 dark:hover:bg-zinc-900"
                      >
                        Download Video
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
