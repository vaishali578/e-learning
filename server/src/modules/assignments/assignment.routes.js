import express from "express";
import {
  createAssignment,
  getStudentAssignments,
  deleteAssignment,
} from "./assignment.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowedRoles } from "../../middlewares/role.middleware.js";

const router = express.Router();

// Get student's assignments from enrolled courses
router.get(
  "/my-assignments",
  protect,
  allowedRoles("student"),
  getStudentAssignments,
);

// Create assignment (trainer only)
router.post("/", protect, allowedRoles("trainer"), createAssignment);

router.delete(
  "/:assignmentId",
  protect,
  allowedRoles("trainer"),
  deleteAssignment,
);
export default router;
