import { NextRequest, NextResponse } from 'next/server';
import { getMongoCollections } from '@/lib/db';
import { deleteVideo } from '@/lib/cloudinary';

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    
    if (!roomId) {
      return NextResponse.json(
        { error: 'Room ID is required' },
        { status: 400 }
      );
    }

    const { Interviews } = await getMongoCollections();
    
    // Find the interview to get the Cloudinary public ID
    const interview = await Interviews.findOne({ roomId });
    
    if (!interview) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    if (!interview.recording?.cloudinaryPublicId) {
      return NextResponse.json(
        { error: 'No recording found for this interview' },
        { status: 404 }
      );
    }

    // Delete from Cloudinary
    try {
      await deleteVideo(interview.recording.cloudinaryPublicId);
    } catch (cloudinaryError) {
      console.error('Failed to delete from Cloudinary:', cloudinaryError);
      // Continue with database cleanup even if Cloudinary deletion fails
    }

    // Remove recording from database
    const result = await Interviews.updateOne(
      { roomId },
      {
        $unset: {
          recording: 1
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Recording deleted successfully'
    });

  } catch (error) {
    console.error('Delete recording error:', error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Failed to delete recording';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
