import asyncHandler from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/appError.js";
import {
  createCourseService,
  getCourseByIdService,
  getMyCoursesService,
  publishCourseService,
  getAllCoursesService,
  getCoursePlayerDataService,
  republishCourseService
} from "./course.service.js";
import Enrollment from "../enrollments/enrollment.model.js";

// ================= CREATE COURSE =================
export const createCourse = asyncHandler(async (req, res) => {

  const {
    title,
    description,
    level = "beginner",
    language = "English",
  } = req.body;

  const price = Number(req.body.price || 0);

  if (!title?.trim() || !description?.trim()) {
    throw new AppError("Title and description are required", 400);
  }

  if (price < 0) {
    throw new AppError("Price cannot be negative", 400);
  }

  let thumbnailUrl = "";

  // ✅ Multer saves file in req.file
  if (req.file) {
    thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
  }

  const course = await createCourseService({
    title: title.trim(),
    description: description.trim(),
    thumbnail: thumbnailUrl,
    price,
    level,
    language,
    trainer: req.user.id,
    status: "draft",
  });

  res.status(201).json({
    success: true,
    message: "Course draft created",
    data: {
      id: course._id,
      title: course.title,
      slug: course.slug,
      status: course.status,
    },
  });
});

// ================= GET COURSE BY ID (TRAINER) =================
export const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await getCourseByIdService(courseId, req.user);

  if (!course) {
    throw new AppError("Course not found", 404);
  }

  res.status(200).json({
    success: true,
    data: course,
  });
});

// ================= GET MY COURSES =================
export const getMyCourses = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  const courses = await getMyCoursesService(userId, role);

  res.status(200).json({
    success: true,
    data: courses,
  });
});

// ================= GET ALL PUBLISHED COURSES =================
export const getAllCourses = asyncHandler(async (req, res) => {

  
  const userId = req.user?.id?.toString(); 
  const role = req.user?.role;

  const { category, level, language, search } = req.query;

  const filter = { status: "published" };
  if (category) filter.category = category;
  if (level) filter.level = level;
  if (language) filter.language = language;
  if (search) filter.title = { $regex: search, $options: "i" };

  const courses = await getAllCoursesService(filter);

  let enrolledCourseIds = [];

  if (userId && role === "student") {
    const enrollments = await Enrollment.find({
      student: userId,
      status: "active",
    })
      .select("course")
      .lean();

    enrolledCourseIds = enrollments.map((e) => e.course.toString());
  }

  const formattedCourses = courses.map((course) => {
    const courseId = course._id.toString();

    const isTrainerView =
      role === "trainer" &&
      course.trainer?._id?.toString() === userId;

    const isEnrolled =
      role === "student" &&
      enrolledCourseIds.includes(courseId);

    return {
      ...course.toObject(),
      isTrainerView,
      isEnrolled,
      isPurchased: isEnrolled,
      canEdit: isTrainerView,
    };
  });

  res.status(200).json({
    success: true,
    count: formattedCourses.length,
    data: formattedCourses,
  });
});


// ================= PUBLISH COURSE =================
export const publishCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await publishCourseService(courseId, req.user.id);

  if (!course) {
    throw new AppError("Course not found or permission denied", 404);
  }

  res.status(200).json({
    success: true,
    message: "Course published successfully",
    data: {
      id: course._id,
      title: course.title,
      status: course.status,
      needsRepublish: course.needsRepublish,
      lastPublishedAt: course.lastPublishedAt,
    },
  });
});


// ================= COURSE PLAYER =================
export const getCoursePlayerData = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const data = await getCoursePlayerDataService(courseId, userId);

    if (!data) {
      return next(new AppError("Course not found", 404));
    }

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};


// ================= REPUBLISH COURSE CONTROLLER =================
export const republishCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const trainerId = req.user.id;

  const course = await republishCourseService(courseId, trainerId);

  if (!course) {
    throw new AppError("Course not found or permission denied", 404);
  }

  res.status(200).json({
    success: true,
    message: "Course republished successfully",
    data: {
      id: course._id,
      title: course.title,
      status: course.status,
      needsRepublish: course.needsRepublish,
      lastPublishedAt: course.lastPublishedAt,
    },
  });
});

