import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadVideo(buffer: Buffer, folder: string = 'interview-recordings'): Promise<{
  url: string;
  publicId: string;
  duration?: number;
}> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder,
        format: 'mp4',
        quality: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error('Upload failed'));
          return;
        }
        
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          duration: result.duration ? Math.round(result.duration) : undefined,
        });
      }
    ).end(buffer);
  });
}

export async function deleteVideo(publicId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: 'video' },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      }
    );
  });
}
