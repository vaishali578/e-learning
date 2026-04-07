import express from "express";
import { createLesson, deleteLesson } from "./lesson.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowedRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Lessons
 *   description: Course lesson management APIs
 */

/**
 * @swagger
 * /api/lessons:
 *   post:
 *     summary: Create a new lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - sectionId
 *               - title
 *             properties:
 *               courseId:
 *                 type: string
 *               sectionId:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               videoUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lesson created successfully
 */
router.post("/", protect, allowedRoles("trainer"), createLesson);

/**
 * @swagger
 * /api/lessons/{lessonId}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Lessons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lesson to delete
 *       - in: query
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: Course ID of the lesson
 *     responses:
 *       200:
 *         description: Lesson deleted successfully
 *       403:
 *         description: Unauthorized deletion
 *       404:
 *         description: Lesson or Course not found
 */
router.delete(
  "/:lessonId",
  protect,
  allowedRoles("trainer"),
  deleteLesson
);

export default router;
