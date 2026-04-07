import fs from "fs";
import cloudinary from "../config/cloudinary.js";
import { getVideoDurationInSeconds } from "get-video-duration";
import User from "../modules/auth/auth.model.js";

export const uploadLessonVideo = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("Video file missing");
    }

    const { courseId, sectionId } = req.body;

    if (!courseId || !sectionId) {
      throw new Error("courseId & sectionId are required");
    }

    // 1️⃣ Get video duration (LOCAL FILE)
    const duration = await getVideoDurationInSeconds(req.file.path);

    // 2️⃣ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
      folder: `courses/${courseId}/sections/${sectionId}/lessons`,
    });

    // 3️⃣ Delete local file
    fs.unlinkSync(req.file.path);

    // 4️⃣ Send data to frontend
    res.status(200).json({
      success: true,
      url: result.secure_url,
      duration: Math.round(duration),
      provider: "cloudinary",
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("Profile photo file missing");
    }

    const userId = req.user.id;

    // 1️⃣ Get existing user
    const user = await User.findById(userId);

    // 2️⃣ Delete old image from Cloudinary (if exists)
    if (user.profilePhoto) {
      const publicId = user.profilePhoto
        .split("/")
        .slice(-3)
        .join("/")
        .split(".")[0];

      await cloudinary.uploader.destroy(publicId);
    }

    // 3️⃣ Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: `users/${userId}/profile`,
      transformation: [
        { width: 300, height: 300, crop: "fill" },
        { quality: "auto" }
      ]
    });

    // 4️⃣ Update DB
    await User.findByIdAndUpdate(userId, {
      profilePhoto: result.secure_url
    });

    // 5️⃣ Remove local file
    await fs.promises.unlink(req.file.path);

    res.status(200).json({
      success: true,
      url: result.secure_url,
      message: "Profile photo updated successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

