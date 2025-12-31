import { NextRequest, NextResponse } from 'next/server';
import { getMongoCollections } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { Interviews } = await getMongoCollections();
    
    // Find all interviews with recordings
    const recordedInterviews = await Interviews.find({
      'recording.cloudinaryUrl': { $exists: true, $ne: null }
    }).sort({ 'recording.recordedAt': -1 }).toArray();

    return NextResponse.json({
      success: true,
      recordings: recordedInterviews.map((interview: any) => ({
        roomId: interview.roomId,
        title: interview.title,
        recordedAt: interview.recording?.recordedAt,
        duration: interview.recording?.duration,
        recordedBy: interview.recording?.recordedBy,
        cloudinaryUrl: interview.recording?.cloudinaryUrl,
        cloudinaryPublicId: interview.recording?.cloudinaryPublicId,
        createdAt: interview.createdAt,
        status: interview.status,
        participants: interview.participants || {},
      }))
    });
  } catch (error) {
    console.error('Error fetching recordings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recordings' },
      { status: 500 }
    );
  }
}
