import Enrollment from "./enrollment.model.js";
import Course from "../courses/course.model.js";
import { AppError } from "../../utils/appError.js";
import mongoose from "mongoose";

/**
 * Create enrollment (free OR paid – skip actual payment)
 */
export const enrollCourseService = async ({ studentId, courseId }) => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new AppError("Invalid course id", 400);
  }

  const course = await Course.findOne({
    _id: courseId,
    status: "published",
  });

  if (!course) {
    throw new AppError("Course not found or unpublished", 404);
  }

  // 🔴 Prevent enrolling in own course
  if (course.trainer.toString() === studentId) {
    throw new AppError("You cannot enroll in your own course", 400);
  }

  // 🔥 Duplicate enrollment check
  const alreadyEnrolled = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (alreadyEnrolled) {
    throw new AppError("Already enrolled in this course", 409);
  }

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
    status: "active",
    progressPercentage: 0,
  });

  // 🔢 Increment course students count
  course.totalStudents += 1;
  await course.save();

  return enrollment;
};

/**
 * Get all enrolled courses for student
 */
export const getMyEnrollmentsService = async (studentId) => {
  return await Enrollment.find({ student: studentId })
    .populate("course", "title description createdAt thumbnail status price level language")
    .sort({ createdAt: -1 });
};

/**
 * Check enrollment (used by guards / UI flags)
 */
export const checkEnrollmentService = async (studentId, courseId) => {
  return await Enrollment.exists({
    student: studentId,
    course: courseId,
    status: "active",
  });
};


export const getMyEnrollmentCoursesService = async (studentId) => {
  return Enrollment.find({
    student: studentId,
    status: "active",
  })
    .populate({
      path: "course",
      select: "title createdAt description slug thumbnail price level language trainer",
    })
    .sort({ createdAt: -1 });
};
