import express from "express";
import { createQuestion } from "./question.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowedRoles } from "../../middlewares/role.middleware.js";

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Questions
 *   description: Quiz question management APIs
 */

/**
 * @swagger
 * /api/quizzes/{quizId}/questions:
 *   post:
 *     summary: Create a question for a quiz
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - questionText
 *               - options
 *               - correctAnswer
 *             properties:
 *               questionText:
 *                 type: string
 *                 example: What is JavaScript?
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example:
 *                   - Programming language
 *                   - Database
 *                   - Browser
 *                   - Operating System
 *               correctAnswer:
 *                 type: string
 *                 example: Programming language
 *     responses:
 *       201:
 *         description: Question created successfully
 *       403:
 *         description: Only trainer can add questions
 */
router.post("/", protect, allowedRoles("trainer"), createQuestion);

export default router;
