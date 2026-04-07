import express from "express";
import {
  getUsers,
  getMyProfileController,
  updateProfileController,
  updateBasicInfoController,
  updatePasswordController,
  updateSocialLinksController,
} from "./user.controller.js";

import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User profile and account management APIs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin / trainer)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
router.get("/", protect, getUsers);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get my profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: My profile fetched successfully
 */
router.get("/me", protect, getMyProfileController);

/**
 * @swagger
 * /api/users/me:
 *   put:
 *     summary: Update name and bio
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Vaishali
 *               bio:
 *                 type: string
 *                 example: MERN Stack Developer
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put("/me", protect, updateProfileController);

/**
 * @swagger
 * /api/users/me/basic-info:
 *   patch:
 *     summary: Update basic user information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               dob:
 *                 type: string
 *                 example: "1999-05-20"
 *     responses:
 *       200:
 *         description: Basic info updated
 */
router.patch("/me/basic-info", protect, updateBasicInfoController);

/**
 * @swagger
 * /api/users/me/password:
 *   patch:
 *     summary: Update account password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: oldpass123
 *               newPassword:
 *                 type: string
 *                 example: newpass456
 *     responses:
 *       200:
 *         description: Password updated successfully
 */
router.patch("/me/password", protect, updatePasswordController);

/**
 * @swagger
 * /api/users/me/social-links:
 *   patch:
 *     summary: Update social media links
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               linkedin:
 *                 type: string
 *                 example: https://linkedin.com/in/username
 *               github:
 *                 type: string
 *                 example: https://github.com/username
 *     responses:
 *       200:
 *         description: Social links updated
 */
router.patch("/me/social-links", protect, updateSocialLinksController);

export default router; 
