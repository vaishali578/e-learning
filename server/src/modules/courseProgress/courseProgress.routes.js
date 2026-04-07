import express from "express";
import {
  markItemCompleteController,
  getCourseProgressController,
} from "./courseProgress.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/* Mark item completed */
router.post(
  "/complete",
  protect,
  markItemCompleteController
);

/* Get progress for course */
router.get(
  "/:courseId",
  protect,
  getCourseProgressController
);

export default router;