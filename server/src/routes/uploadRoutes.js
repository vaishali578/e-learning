import express from "express";
import { uploadVideo } from "../middlewares/videoUpload.js";
import { uploadThumbnail } from "../middlewares/uploadThumbnail.middleware.js";
import { uploadLessonVideo, uploadProfilePhoto } from "../controllers/upload.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/video",
  protect,
  uploadVideo.single("video"),
  uploadLessonVideo
);

router.post(
  "/profile-photo",
  protect,
  uploadThumbnail.single("profilePhoto"),
  uploadProfilePhoto
);

export default router;
