import express from "express";
import { syncFriendData } from "./friendRequest.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: Friend request and social sync APIs
 */

/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: Sync friend request and friend list data
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Friend data synced successfully
 */
router.get("/", protect, syncFriendData);

export default router;
