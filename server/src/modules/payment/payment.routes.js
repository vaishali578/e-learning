import express from "express";
import { createPaymentIntent, confirmPayment } from "./payment.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment and checkout APIs
 */

/**
 * @swagger
 * /api/payments/create-intent:
 *   post:
 *     summary: Create payment intent
 *     tags: [Payments]
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
 *             properties:
 *               courseId:
 *                 type: string
 *                 example: 65f2abc12345
 *     responses:
 *       200:
 *         description: Payment intent created successfully
 *       400:
 *         description: Invalid request
 */
router.post("/create-intent", protect, createPaymentIntent);

/**
 * @swagger
 * /api/payments/confirm:
 *   post:
 *     summary: Confirm payment (testing / webhook support)
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentIntentId:
 *                 type: string
 *                 example: pi_3NzXXXX
 *     responses:
 *       200:
 *         description: Payment confirmed successfully
 */
router.post("/confirm", protect, confirmPayment);

export default router;
