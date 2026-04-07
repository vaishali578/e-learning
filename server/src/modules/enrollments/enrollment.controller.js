import asyncHandler from "../../utils/asyncHandler.js";
import {
  enrollCourseService,
  getMyEnrollmentsService,
  checkEnrollmentService,
} from "./enrollment.service.js";
import { getMyEnrollmentCoursesService } from "./enrollment.service.js";

/**
 * GET /api/enrollments/my
 */
export const getMyEnrollments = asyncHandler(async (req, res) => {
  const studentId = req.user.id;

  const enrollments = await getMyEnrollmentsService(studentId);

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments,
  });
});

/**
 * GET /api/enrollments/check/:courseId
 */
export const checkEnrollment = asyncHandler(async (req, res) => {
  const studentId = req.user.id;
  const { courseId } = req.params;

  const enrolled = await checkEnrollmentService(studentId, courseId);

  res.status(200).json({
    success: true,
    isEnrolled: !!enrolled,
  });
});


export const getMyEnrolledCourses = async (req, res, next) => {
  console.time("getMyCourses");
  const user = req.user;


  if (user.role !== "student") {
    return next(new AppError("Only students can access enrolled courses", 403));
  }

  const enrollments = await getMyEnrollmentCoursesService(user.id);

  res.status(200).json({
    success: true,
    count: enrollments.length,
    data: enrollments,
  });
   console.timeEnd("getMyCourses");
};
