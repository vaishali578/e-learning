import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import * as scheduleService from "./schedule.service.js";

// @route   GET /api/schedules/course/:courseId
// @access  Public
export const getCourseSchedules = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { status, startDate } = req.query;

  const schedules = await scheduleService.getCourseSchedules(courseId, {
    status,
    startDate,
  });

  res.status(200).json({
    success: true,
    data: schedules,
  });
});

// @route   GET /api/schedules/student/my
// @access  Private (Student)
export const getStudentSchedules = asyncHandler(async (req, res) => {
  const { status, upcoming } = req.query;
  const studentId = req.user._id;

  const schedules = await scheduleService.getStudentSchedules(studentId, {
    status,
    upcoming: upcoming === "true",
  });

  res.status(200).json({
    success: true,
    data: schedules,
  });
});

// @route   GET /api/schedules/trainer/my
// @access  Private (Trainer)
export const getTrainerSchedules = asyncHandler(async (req, res) => {
  const { status, startDate } = req.query;
  const trainerId = req.user._id;

  const schedules = await scheduleService.getTrainerSchedules(trainerId, {
    status,
    startDate,
  });

  res.status(200).json({
    success: true,
    data: schedules,
  });
});

// @route   GET /api/schedules/:scheduleId
// @access  Public
export const getScheduleDetails = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;

  const schedule = await scheduleService.getScheduleDetails(scheduleId);

  res.status(200).json({
    success: true,
    data: schedule,
  });
});

// @route   POST /api/schedules
// @access  Private (Trainer)
export const createSchedule = asyncHandler(async (req, res) => {
  const trainerId = req.user._id;

  const schedule = await scheduleService.createSchedule(req.body, trainerId);

  res.status(201).json({
    success: true,
    message: "Schedule created successfully",
    data: schedule,
  });
});

// @route   PUT /api/schedules/:scheduleId
// @access  Private (Trainer)
export const updateSchedule = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;
  const trainerId = req.user._id;

  const schedule = await scheduleService.updateSchedule(
    scheduleId,
    req.body,
    trainerId
  );

  res.status(200).json({
    success: true,
    message: "Schedule updated successfully",
    data: schedule,
  });
});

// @route   DELETE /api/schedules/:scheduleId
// @access  Private (Trainer)
export const deleteSchedule = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;
  const trainerId = req.user._id;

  const result = await scheduleService.deleteSchedule(scheduleId, trainerId);

  res.status(200).json({
    success: true,
    message: result.message,
  });
});

// @route   POST /api/schedules/:scheduleId/rsvp
// @access  Private (Student)
export const rsvpToSchedule = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;
  const { status } = req.body;
  const studentId = req.user._id;

  if (!status) {
    throw new AppError("RSVP status is required", 400);
  }

  const schedule = await scheduleService.rsvpToSchedule(
    scheduleId,
    studentId,
    status
  );

  res.status(200).json({
    success: true,
    message: "RSVP updated successfully",
    data: schedule,
  });
});

// @route   POST /api/schedules/:scheduleId/attendance/:studentId
// @access  Private (Trainer)
export const markAttendance = asyncHandler(async (req, res) => {
  const { scheduleId, studentId } = req.params;
  const { status } = req.body;
  const trainerId = req.user._id;

  if (!status) {
    throw new AppError("Attendance status is required", 400);
  }

  const schedule = await scheduleService.markAttendance(
    scheduleId,
    studentId,
    status,
    trainerId
  );

  res.status(200).json({
    success: true,
    message: "Attendance marked successfully",
    data: schedule,
  });
});

// @route   POST /api/schedules/:scheduleId/cancel
// @access  Private (Trainer)
export const cancelSchedule = asyncHandler(async (req, res) => {
  const { scheduleId } = req.params;
  const { reason } = req.body;
  const trainerId = req.user._id;

  const schedule = await scheduleService.cancelSchedule(
    scheduleId,
    trainerId,
    reason
  );

  res.status(200).json({
    success: true,
    message: "Schedule cancelled successfully",
    data: schedule,
  });
});
