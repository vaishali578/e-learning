import Section from "./section.model.js";
import Course from "../courses/course.model.js";
import { AppError } from "../../utils/appError.js";

export const createSectionService = async (data) => {
  // 1️⃣ Check course exists
  const course = await Course.findById(data.course);
  if (!course) throw new AppError("Course not found", 404);

  // 2️⃣ Ensure trainer owns the course
  if (course.trainer.toString() !== data.createdBy.toString()) {
    throw new AppError("You are not allowed to add section to this course", 403);
  }

  // 3️⃣ Auto-calculate order
  const lastSection = await Section.findOne({ course: data.course })
    .sort({ order: -1 })
    .select("order");

  const nextOrder = lastSection ? lastSection.order + 1 : 1;

  // 4️⃣ Create section
  const section = await Section.create({
    ...data,
    order: nextOrder,
    isPublished: false,
  });

  // 5️⃣ Push into course
  course.sections.push(section._id);

  /* ===================== 🔥 IMPORTANT FIX ===================== */
  // If course was published, mark for republish
  if (course.status === "published") {
    course.needsRepublish = true;
  }
  /* ============================================================ */

  await course.save();

  return section;
};

export const deleteSectionService = async ({
  sectionId,
  courseId,
  deletedBy,
}) => {
  const session = await Section.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Validate course
    const course = await Course.findById(courseId).session(session);
    if (!course) throw new AppError("Course not found", 404);

    // 2️⃣ Ownership check
    if (course.trainer.toString() !== deletedBy.toString()) {
      throw new AppError("Not authorized to delete section", 403);
    }

    // 3️⃣ Find section
    const section = await Section.findById(sectionId).session(session);
    if (!section) throw new AppError("Section not found", 404);

    // 4️⃣ Ensure section belongs to course
    if (section.course.toString() !== courseId.toString()) {
      throw new AppError("Section does not belong to this course", 400);
    }

    // 5️⃣ Ensure section has NO content
    if (section.contents && section.contents.length > 0) {
      throw new AppError(
        "Cannot delete section with existing lessons/quizzes/assignments",
        400
      );
    }

    // 6️⃣ Remove section from course.sections array
    course.sections.pull(sectionId);

    // 7️⃣ Mark for republish if course published
    if (course.status === "published") {
      course.needsRepublish = true;
    }

    await course.save({ session });

    // 8️⃣ Delete section
    await Section.findByIdAndDelete(sectionId).session(session);

    await session.commitTransaction();
    session.endSession();

    return true;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const updateSectionService = async ({
  sectionId,
  title,
  updatedBy,
}) => {
  const session = await Section.startSession();
  session.startTransaction();

  try {
    // 1️⃣ Find section
    const section = await Section.findById(sectionId).session(session);
    if (!section) throw new AppError("Section not found", 404);

    // 2️⃣ Validate course
    const course = await Course.findById(section.course).session(session);
    if (!course) throw new AppError("Course not found", 404);

    // 3️⃣ Ownership check
    if (course.trainer.toString() !== updatedBy.toString()) {
      throw new AppError("Not authorized to update section", 403);
    }

    // 4️⃣ Update title
    section.title = title?.trim() || section.title;
    await section.save({ session });

    // 5️⃣ Mark course for republish if needed
    if (course.status === "published") {
      course.needsRepublish = true;
      await course.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    return section;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
