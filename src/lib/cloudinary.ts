import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export async function uploadImageToCloudinary(
  fileBase64OrPath: string,
  folder: string = 'coral-room'
): Promise<UploadResult> {
  const result = await cloudinary.uploader.upload(fileBase64OrPath, {
    folder,
    resource_type: 'auto',
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  };
}

export async function deleteImageFromCloudinary(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
}

export default cloudinary;
