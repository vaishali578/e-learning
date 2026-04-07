import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import { createSectionService, deleteSectionService, updateSectionService } from "./section.service.js";

export const createSection = asyncHandler(async (req, res) => {
  const { title, description, courseId } = req.body;

  if (!title?.trim()) {
    throw new AppError("Section title is required", 400);
  }

  if (!courseId) {
    throw new AppError("Course id is required", 400);
  }

  const section = await createSectionService({
    title: title.trim(),
    course: courseId,
    createdBy: req.user.id, // trainer from token
  });

  res.status(201).json({
    success: true,
    message: "Section created successfully",
    data: section,
  });
});

export const deleteSection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  const { courseId } = req.query;

  if (!sectionId || !courseId) {
    throw new AppError("Section id and course id are required", 400);
  }

  await deleteSectionService({
    sectionId,
    courseId,
    deletedBy: req.user.id,
  });

  res.status(200).json({
    success: true,
    message: "Section deleted successfully",
  });
});

export const updateSection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  const { title } = req.body;

  if (!sectionId || !title) {
    throw new AppError("Section id and title are required", 400);
  }

  const updatedSection = await updateSectionService({
    sectionId,
    title,
    updatedBy: req.user.id,
  });

  res.status(200).json({
    success: true,
    data: updatedSection,
  });
});