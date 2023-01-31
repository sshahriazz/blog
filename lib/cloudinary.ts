import cloudinary, { UploadApiResponse } from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/////////////////////////
// Uploads an image file
/////////////////////////
export const uploadImage = async (
  imagePath: any
): Promise<UploadApiResponse | undefined> => {
  // Use the uploaded file's name as the asset's public ID and
  // allow overwriting the asset with new versions
  const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };

  try {
    // Upload the image
    const result = await cloudinary.v2.uploader.upload(imagePath, options);

    return result;
  } catch (error) {
    console.error(error);
  }
};
export default cloudinary;
