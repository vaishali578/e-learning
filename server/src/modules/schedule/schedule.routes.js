import express from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { allowedRoles } from "../../middlewares/role.middleware.js";
import * as scheduleController from "./schedule.controller.js";

const router = express.Router();

// Public routes
router.get("/course/:courseId", scheduleController.getCourseSchedules);
router.get("/:scheduleId", scheduleController.getScheduleDetails);

// Student routes (authenticated)
router.post("/:scheduleId/rsvp", protect, scheduleController.rsvpToSchedule);
router.get("/student/my", protect, scheduleController.getStudentSchedules);

// Trainer routes (authenticated + authorized)
router.post("/", protect, allowedRoles("trainer"), scheduleController.createSchedule);
router.put("/:scheduleId", protect, allowedRoles("trainer"), scheduleController.updateSchedule);
router.delete("/:scheduleId", protect, allowedRoles("trainer"), scheduleController.deleteSchedule);
router.post("/:scheduleId/cancel", protect, allowedRoles("trainer"), scheduleController.cancelSchedule);
router.post("/:scheduleId/attendance/:studentId", protect, allowedRoles("trainer"), scheduleController.markAttendance);
router.get("/trainer/my", protect, allowedRoles("trainer"), scheduleController.getTrainerSchedules);

export default router;
