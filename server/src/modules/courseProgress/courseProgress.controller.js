import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";

import {
  markItemCompleteService,
  getCourseProgressService,
} from "./courseProgress.service.js";

/* ===============================
   MARK ITEM COMPLETE
================================= */
export const markItemCompleteController = asyncHandler(
  async (req, res) => {
    const { courseId, itemId, itemType } = req.body;

    if (!courseId || !itemId || !itemType) {
      throw new AppError(
        "courseId, itemId and itemType are required",
        400
      );
    }

    await markItemCompleteService({
      studentId: req.user._id,
      courseId,
      itemId,
      itemType,
    });

    res.status(200).json({
      success: true,
      message: "Item marked as completed",
    });
  }
);

/* ===============================
   GET COURSE PROGRESS
================================= */
export const getCourseProgressController = asyncHandler(
  async (req, res) => {
    const { courseId } = req.params;

    if (!courseId) {
      throw new AppError("Course ID is required", 400);
    }

    const data = await getCourseProgressService(
      req.user._id,
      courseId
    );

    res.status(200).json({
      success: true,
      data,
    });
  }
);