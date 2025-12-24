import cloudinary from "@/lib/cloudinary";

type UploadFolder = "thumbnails" | "content";

export class UploadService {
  // Upload image to Cloudinary
  static async uploadImage(file: File, folder: UploadFolder = "content") {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Convert buffer to base64
      const base64Image = `data:${file.type};base64,${buffer.toString(
        "base64"
      )}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(base64Image, {
        folder: `binarystories/${folder}`,
        transformation: [
          { width: 1200, height: 630, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw new Error("Failed to upload image");
    }
  }

  // Delete image from Cloudinary
  static async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);

      return {
        success: result.result === "ok",
      };
    } catch (error) {
      console.error("Delete error:", error);
      throw new Error("Failed to delete image");
    }
  }

  // Upload image from URL (for drag & drop in rich text editor)
  static async uploadFromUrl(url: string, folder: UploadFolder = "content") {
    try {
      const result = await cloudinary.uploader.upload(url, {
        folder: `binarystories/${folder}`,
        transformation: [
          { width: 1200, height: 630, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error) {
      console.error("Upload from URL error:", error);
      throw new Error("Failed to upload image from URL");
    }
  }
}
