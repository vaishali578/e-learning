import Schedule from "./schedule.model.js";
import Course from "../courses/course.model.js";
import { AppError } from "../../utils/appError.js";

// Get all schedules for a course
export const getCourseSchedules = async (courseId, filters = {}) => {
  try {
    const query = { course: courseId, isCancelled: false };

    if (filters.status) query.status = filters.status;
    if (filters.startDate) {
      query.startDate = { $gte: new Date(filters.startDate) };
    }

    const schedules = await Schedule.find(query)
      .populate("trainer", "name email avatar")
      .populate("course", "title")
      .sort({ startDate: 1 });

    return schedules;
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

// Get schedules for a student
export const getStudentSchedules = async (studentId, filters = {}) => {
  try {
    const query = { isCancelled: false };

    if (filters.status) query.status = filters.status;
    if (filters.upcoming) {
      query.startDate = { $gte: new Date() };
    }

    const schedules = await Schedule.find(query)
      .populate("trainer", "name email avatar")
      .populate("course", "title")
      .populate("rsvps.student", "name")
      .sort({ startDate: 1 });

    // Add current student's RSVP status
    const schedulesWithRsvp = schedules.map((schedule) => {
      const studentRsvp = schedule.rsvps.find(
        (r) => r.student._id.toString() === studentId
      );
      return {
        ...schedule.toObject(),
        studentRsvpStatus: studentRsvp?.status || null,
      };
    });

    return schedulesWithRsvp;
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

// Get schedules for a trainer
export const getTrainerSchedules = async (trainerId, filters = {}) => {
  try {
    const query = { trainer: trainerId, isCancelled: false };

    if (filters.status) query.status = filters.status;
    if (filters.startDate) {
      query.startDate = { $gte: new Date(filters.startDate) };
    }

    const schedules = await Schedule.find(query)
      .populate("course", "title")
      .populate("rsvps.student", "name email avatar")
      .populate("attendance.student", "name email")
      .sort({ startDate: -1 });

    return schedules;
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

// Create schedule
export const createSchedule = async (scheduleData, trainerId) => {
  try {
    // Verify trainer owns the course
    const course = await Course.findOne({
      _id: scheduleData.course,
      trainer: trainerId,
    });

    if (!course) {
      throw new AppError("Course not found or you don't have permission", 403);
    }

    // Validate dates
    const startDate = new Date(scheduleData.startDate);
    const endDate = new Date(scheduleData.endDate);

    if (startDate >= endDate) {
      throw new AppError("Start date must be before end date", 400);
    }

    // Create schedule
    const schedule = new Schedule({
      ...scheduleData,
      trainer: trainerId,
    });

    await schedule.save();

    return schedule.populate([
      { path: "trainer", select: "name email avatar" },
      { path: "course", select: "title" },
    ]);
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

// Update schedule
export const updateSchedule = async (scheduleId, updates, trainerId) => {
  try {
    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    if (schedule.trainer.toString() !== trainerId) {
      throw new AppError("You don't have permission to update this schedule", 403);
    }

    if (schedule.status === "completed") {
      throw new AppError("Cannot update completed schedule", 400);
    }

    // Validate dates if updating
    if (updates.startDate || updates.endDate) {
      const startDate = updates.startDate
        ? new Date(updates.startDate)
        : schedule.startDate;
      const endDate = updates.endDate
        ? new Date(updates.endDate)
        : schedule.endDate;

      if (startDate >= endDate) {
        throw new AppError("Start date must be before end date", 400);
      }
    }

    Object.assign(schedule, updates);
    await schedule.save();

    return schedule.populate([
      { path: "trainer", select: "name email avatar" },
      { path: "course", select: "title" },
    ]);
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

// RSVP to schedule
export const rsvpToSchedule = async (scheduleId, studentId, status) => {
  try {
    if (!["attending", "not_attending", "maybe"].includes(status)) {
      throw new AppError("Invalid RSVP status", 400);
    }

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    if (schedule.isCancelled) {
      throw new AppError("Cannot RSVP to a cancelled schedule", 400);
    }

    // Check if student already RSVP'd
    const existingRsvp = schedule.rsvps.findIndex(
      (r) => r.student.toString() === studentId
    );

    if (existingRsvp !== -1) {
      schedule.rsvps[existingRsvp].status = status;
      schedule.rsvps[existingRsvp].rsvpedAt = new Date();
    } else {
      schedule.rsvps.push({
        student: studentId,
        status,
        rsvpedAt: new Date(),
      });
    }

    await schedule.save();

    return schedule.populate([
      { path: "trainer", select: "name email avatar" },
      { path: "rsvps.student", select: "name email avatar" },
    ]);
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

// Mark attendance
export const markAttendance = async (scheduleId, studentId, status, trainerId) => {
  try {
    if (!["present", "absent", "late"].includes(status)) {
      throw new AppError("Invalid attendance status", 400);
    }

    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    if (schedule.trainer.toString() !== trainerId) {
      throw new AppError("You don't have permission to mark attendance", 403);
    }

    // Check if attendance already marked
    const existingAttendance = schedule.attendance.findIndex(
      (a) => a.student.toString() === studentId
    );

    if (existingAttendance !== -1) {
      schedule.attendance[existingAttendance].status = status;
    } else {
      schedule.attendance.push({
        student: studentId,
        status,
        presentAt: new Date(),
      });
    }

    if (status === "present") {
      schedule.attendedCount = schedule.attendance.filter(
        (a) => a.status === "present"
      ).length;
    }

    await schedule.save();

    return schedule.populate([
      { path: "attendance.student", select: "name email" },
    ]);
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

// Cancel schedule
export const cancelSchedule = async (scheduleId, trainerId, reason) => {
  try {
    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    if (schedule.trainer.toString() !== trainerId) {
      throw new AppError("You don't have permission to cancel this schedule", 403);
    }

    schedule.isCancelled = true;
    schedule.status = "cancelled";
    schedule.cancellationReason = reason || "";

    await schedule.save();

    return schedule;
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

// Get single schedule with details
export const getScheduleDetails = async (scheduleId) => {
  try {
    const schedule = await Schedule.findById(scheduleId)
      .populate("trainer", "name email avatar")
      .populate("course", "title description")
      .populate("lesson", "title")
      .populate("rsvps.student", "name email avatar")
      .populate("attendance.student", "name email");

    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    return schedule;
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

// Delete schedule (only if not started)
export const deleteSchedule = async (scheduleId, trainerId) => {
  try {
    const schedule = await Schedule.findById(scheduleId);

    if (!schedule) {
      throw new AppError("Schedule not found", 404);
    }

    if (schedule.trainer.toString() !== trainerId) {
      throw new AppError("You don't have permission to delete this schedule", 403);
    }

    if (schedule.status === "in_progress" || schedule.status === "completed") {
      throw new AppError("Cannot delete an ongoing or completed schedule", 400);
    }

    await Schedule.findByIdAndDelete(scheduleId);

    return { message: "Schedule deleted successfully" };
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};
