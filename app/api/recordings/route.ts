import { NextRequest, NextResponse } from 'next/server';
import { getMongoCollections } from '@/lib/db';
import { uploadVideo } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    const roomId = formData.get('roomId') as string;
    const recordedBy = formData.get('recordedBy') as string;

    if (!video || !roomId) {
      return NextResponse.json(
        { error: 'Missing video file or room ID' },
        { status: 400 }
      );
    }

    if (typeof video.size === 'number' && video.size === 0) {
      return NextResponse.json(
        { error: 'Empty recording received (0 bytes). Please try recording again.' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await video.arrayBuffer());
    const uploadResult = await uploadVideo(buffer);

    const { Interviews } = await getMongoCollections();
    await Interviews.updateOne(
      { roomId },
      {
        $set: {
          recording: {
            cloudinaryUrl: uploadResult.url,
            cloudinaryPublicId: uploadResult.publicId,
            duration: uploadResult.duration,
            recordedAt: new Date(),
            recordedBy: recordedBy || 'admin',
          },
        },
      }
    );

    return NextResponse.json({
      success: true,
      recording: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
        duration: uploadResult.duration,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    const message =
      error instanceof Error
        ? error.message
        : typeof error === 'string'
          ? error
          : 'Failed to upload recording';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
