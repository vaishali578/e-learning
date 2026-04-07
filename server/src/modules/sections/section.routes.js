import express from "express";
import { createSection, deleteSection, updateSection } from "./section.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowedRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Sections
 *   description: Course section management APIs
 */

/**
 * @swagger
 * /api/sections:
 *   post:
 *     summary: Create a new section in a course
 *     tags: [Sections]
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
 *                 example: Introduction Section
 *     responses:
 *       201:
 *         description: Section created successfully
 *       403:
 *         description: Only trainer can create sections
 */
router.post("/", protect, allowedRoles("trainer"), createSection);

router.delete(
  "/:sectionId",
  protect,
  allowedRoles("trainer"),
  deleteSection
);

router.patch(
  "/:sectionId",
  protect,
  allowedRoles("trainer"),
  updateSection
);

export default router;
