import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import { createAssignmentService, getStudentAssignmentsService , deleteAssignmentService} from "./assignment.service.js";

export const createAssignment = asyncHandler(async (req, res) => {
  const {
    title,
    instructions,
    courseId,
    sectionId,
    submissionType,
    maxMarks,
    dueDate,
  } = req.body;

  if (!title?.trim()) {
    throw new AppError("Assignment title is required", 400);
  }

  if (!instructions?.trim()) {
    throw new AppError("Assignment instructions are required", 400);
  }

  if (!courseId || !sectionId) {
    throw new AppError("Course and section are required", 400);
  }

  if (!maxMarks || maxMarks <= 0) {
    throw new AppError("Max marks must be greater than 0", 400);
  }

  const assignment = await createAssignmentService({
    title: title.trim(),
    instructions,
    course: courseId,
    section: sectionId,
    submissionType,
    maxMarks,
    dueDate,
    createdBy: req.user.id, // trainer
  });

  res.status(201).json({
    success: true,
    message: "Assignment created successfully",
    data: {
      id: assignment._id,
      title: assignment.title,
      order: assignment.order,
      isPublished: assignment.isPublished,
    },
  });
});

/**
 * GET /api/assignments/my-assignments
 * Get all assignments for logged-in student from their enrolled courses
 */
export const getStudentAssignments = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const assignments = await getStudentAssignmentsService(studentId);

  res.status(200).json({
    success: true,
    count: assignments.length,
    data: assignments,
  });
});

export const deleteAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { courseId } = req.query;

  if (!assignmentId || !courseId) {
    throw new AppError("Assignment id and course id are required", 400);
  }

  await deleteAssignmentService({
    assignmentId,
    courseId,
    deletedBy: req.user.id,
  });

  res.status(200).json({
    success: true,
    message: "Assignment deleted successfully",
  });
});

