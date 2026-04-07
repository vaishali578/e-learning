import express from "express";
import {
  createQuiz,
  getQuizForStudent,
  getQuizWithAnswers,
  getStudentQuizzes,
  deleteQuiz,
} from "./quiz.controller.js";
import questionRoutes from "./question.routes.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowedRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Quizzes
 *   description: Quiz management APIs
 */

/**
 * @swagger
 * /api/quizzes/my-quizzes:
 *   get:
 *     summary: Get quizzes from enrolled courses
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Student quizzes fetched
 */
router.get("/my-quizzes", protect, allowedRoles("student"), getStudentQuizzes);

/**
 * @swagger
 * /api/quizzes:
 *   post:
 *     summary: Create a quiz (trainer only)
 *     tags: [Quizzes]
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
 *               - title
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: 65f2abc12345
 *               title:
 *                 type: string
 *                 example: JavaScript Basics Quiz
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Quiz created successfully
 */
router.post("/", protect, allowedRoles("trainer"), createQuiz);

/**
 * @swagger
 * /api/quizzes/{quizId}:
 *   get:
 *     summary: Get quiz for student (no answers)
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz fetched successfully
 */
router.get("/:quizId", protect, getQuizForStudent);

/**
 * @swagger
 * /api/quizzes/{quizId}/results:
 *   get:
 *     summary: Get quiz results with correct answers
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz results fetched
 */
router.get("/:quizId/results", protect, getQuizWithAnswers);

router.delete("/:quizId", protect, allowedRoles("trainer"), deleteQuiz);

/**
 * @swagger
 * /api/quizzes/{quizId}/questions:
 *   summary: Quiz questions APIs
 *   description: Manage quiz questions
 */
router.use("/:quizId/questions", protect, questionRoutes);

export default router;
