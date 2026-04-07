import Assignment from "./assignment.model.js";
import Section from "../sections/section.model.js";
import Course from "../courses/course.model.js";
import Enrollment from "../enrollments/enrollment.model.js";
import { AppError } from "../../utils/appError.js";
import mongoose from "mongoose";

export const createAssignmentService = async (data) => {
  // 1️⃣ Validate course
  const course = await Course.findById(data.course);
  if (!course) {
    throw new AppError("Course not found", 404);
  }

  // 2️⃣ Ownership check
  if (course.trainer.toString() !== data.createdBy.toString()) {
    throw new AppError("Not authorized to add assignment", 403);
  }

  // 3️⃣ Validate section
  const section = await Section.findById(data.section);
  if (!section) {
    throw new AppError("Section not found", 404);
  }

  // 4️⃣ Auto order
  const lastAssignment = await Assignment.findOne({ section: data.section })
    .sort({ order: -1 })
    .select("order");

  const nextOrder = lastAssignment ? lastAssignment.order + 1 : 1;

  // 5️⃣ Create assignment
  const assignment = await Assignment.create({
    ...data,
    order: nextOrder,
    isPublished: false,
  });

  if (course.status === "published") {
    course.needsRepublish = true;
    await course.save();
  }

  return assignment;
};


/**
 * Get assignments for a student from their enrolled courses
 */
export const getStudentAssignmentsService = async (studentId) => {
  try {
    // Get all enrolled courses for the student
    const enrollments = await Enrollment.find({
      student: new mongoose.Types.ObjectId(studentId),
      status: "active",
    }).select("course");

    const enrolledCourseIds = enrollments.map((e) => e.course);

    if (enrolledCourseIds.length === 0) {
      return [];
    }

    // Get all published assignments from enrolled courses
    const assignments = await Assignment.find({
      course: { $in: enrolledCourseIds },
      isPublished: true,
    })
      .populate("course", "title")
      .populate("section", "title")
      .populate("submissions", "-__v")
      .sort({ createdAt: -1 })
      .lean();

    // Transform assignments data to include submission status for the student
    const studentAssignments = assignments.map((assignment) => {
      const studentSubmission = assignment.submissions?.find(
        (sub) => sub.student.toString() === studentId
      );

      return {
        _id: assignment._id,
        id: assignment._id,
        title: assignment.title,
        instructions: assignment.instructions,
        course: assignment.course,
        section: assignment.section,
        submissionType: assignment.submissionType,
        maxMarks: assignment.maxMarks,
        dueDate: assignment.dueDate,
        status: studentSubmission
          ? studentSubmission.marksObtained !== null
            ? "submitted"
            : "pending"
          : "todo",
        submitted: !!studentSubmission,
        marksObtained: studentSubmission?.marksObtained || null,
        feedback: studentSubmission?.feedback || "",
        submittedAt: studentSubmission?.submittedAt || null,
        createdAt: assignment.createdAt,
      };
    });

    return studentAssignments;
  } catch (error) {
    throw error;
  }
};

export const deleteAssignmentService = async ({
  assignmentId,
  courseId,
  deletedBy,
}) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Validate course
    const course = await Course.findById(courseId).session(session);
    if (!course) throw new AppError("Course not found", 404);

    // 2️⃣ Ownership check
    if (course.trainer.toString() !== deletedBy.toString()) {
      throw new AppError("Not authorized to delete assignment", 403);
    }

    // 3️⃣ Find assignment
    const assignment = await Assignment.findById(assignmentId).session(session);
    if (!assignment) throw new AppError("Assignment not found", 404);

    // 4️⃣ Safety check → assignment belongs to course
    if (assignment.course.toString() !== courseId.toString()) {
      throw new AppError(
        "Assignment does not belong to this course",
        400
      );
    }

    // 5️⃣ Remove assignment from section contents (if stored there)
    await Section.findByIdAndUpdate(
      assignment.section,
      { $pull: { contents: assignment._id } },
      { session }
    );

    // 6️⃣ Delete assignment (this also deletes submissions if embedded)
    await Assignment.findByIdAndDelete(assignmentId).session(session);

    // 7️⃣ Mark course for republish if published
    if (course.status === "published") {
      course.needsRepublish = true;
      await course.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

