import express from "express";
import {
  createCourse,
  getCourseById,
  getMyCourses,
  publishCourse,
  getAllCourses,
  getCoursePlayerData,
  republishCourse
} from "./course.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowedRoles } from "../../middlewares/role.middleware.js";
import { uploadThumbnail } from "../../middlewares/uploadThumbnail.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management APIs
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses fetched successfully
 */
router.get("/", protect, getAllCourses);

/**
 * @swagger
 * /api/courses/my-courses:
 *   get:
 *     summary: Get trainer's courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trainer courses fetched
 */
router.get("/my-courses", protect, allowedRoles("trainer"), getMyCourses);

/**
 * @swagger
 * /api/courses/{courseId}/player:
 *   get:
 *     summary: Get course player data
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Player data fetched
 */
router.get("/:courseId/player", protect, getCoursePlayerData);

/**
 * @swagger
 * /api/courses/{courseId}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course fetched successfully
 */
router.get("/:courseId", protect, getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - thumbnail
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Course created successfully
 */
router.post(
  "/",
  protect,
  allowedRoles("trainer"),
  uploadThumbnail.single("thumbnail"),
  createCourse
);

/**
 * @swagger
 * /api/courses/{courseId}/publish:
 *   patch:
 *     summary: Publish a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course published successfully
 */
router.patch(
  "/:courseId/publish",
  protect,
  allowedRoles("trainer"),
  publishCourse
);


/**
 * @swagger
 * /api/courses/{courseId}/republish:
 *   patch:
 *     summary: Republish a course after updates
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course republished successfully
 */
router.patch(
  "/:courseId/republish",
  protect,     
  allowedRoles("trainer"),
  republishCourse
);


export default router;
