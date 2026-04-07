import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import { createLessonService, deleteLessonService } from "./lesson.service.js";

export const createLesson = asyncHandler(async (req, res) => {
  const {
    title,
    description = "",
    courseId,
    sectionId,
    type,
    video,
    content,
    liveClass,
    isPreview = false,
  } = req.body;

  /* ------------------ BASIC VALIDATIONS ------------------ */

  if (!title || !title.trim()) {
    throw new AppError("Lesson title is required", 400);
  }

  if (!courseId) {
    throw new AppError("Course ID is required", 400);
  }

  if (!sectionId) {
    throw new AppError("Section ID is required", 400);
  }

  if (!type) {
    throw new AppError("Lesson type is required", 400);
  }

  /* ------------------ TYPE BASED VALIDATION ------------------ */

  if (type === "video" && !video?.url) {
    throw new AppError("Video data is required for video lesson", 400);
  }

  if (type === "article" && !content?.trim()) {
    throw new AppError("Content is required for article lesson", 400);
  }

  if (type === "live" && !liveClass) {
    throw new AppError("Live class details are required", 400);
  }

  /* ------------------ SERVICE CALL ------------------ */

  const lesson = await createLessonService({
    title: title.trim(),
    description: description.trim(),
    course: courseId,
    section: sectionId,
    type,
    video,
    content,
    liveClass,
    isPreview: Boolean(isPreview),
    createdBy: req.user.id, // trainer from JWT
  });

  /* ------------------ RESPONSE ------------------ */

  res.status(201).json({
    success: true,
    message: "Lesson created successfully",
    data: lesson
  });
});

export const deleteLesson = asyncHandler(async (req, res) => {
  const { lessonId, courseId } = req.body;

  if (!lessonId || !courseId) {
    throw new AppError("Lesson id and course id are required", 400);
  }

  await deleteLessonService({
    lessonId,
    courseId,
    deletedBy: req.user.id,
  });

  res.status(200).json({
    success: true,
    message: "Lesson deleted successfully",
  });
});

