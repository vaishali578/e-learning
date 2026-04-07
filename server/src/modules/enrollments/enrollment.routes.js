import express from "express";
import {
  getMyEnrollments,
  checkEnrollment,
  getMyEnrolledCourses
} from "./enrollment.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowedRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Student enrollment related APIs
 */

/**
 * @swagger
 * /api/enrollments/my:
 *   get:
 *     summary: Get my enrollments
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrollment list fetched
 */
router.get("/my", protect, allowedRoles("student"), getMyEnrollments);

/**
 * @swagger
 * /api/enrollments/my-courses:
 *   get:
 *     summary: Get enrolled courses for student
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrolled courses fetched
 */
router.get("/my-courses", protect, getMyEnrolledCourses);

/**
 * @swagger
 * /api/enrollments/check/{courseId}:
 *   get:
 *     summary: Check student enrollment in a course
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID
 *     responses:
 *       200:
 *         description: Enrollment status returned
 *       404:
 *         description: Enrollment not found
 */
router.get(
  "/check/:courseId",
  protect,
  allowedRoles("student"),
  checkEnrollment
);

export default router;
