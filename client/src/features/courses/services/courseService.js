import api from "../../../services/api";

// ✅ Create a new course
export const createCourse = async (courseData) => {
  const formData = new FormData();

  Object.entries(courseData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  const response = await api.post("/courses", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// ✅ Get course by ID
export const getCourseById = async (courseId) => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data.data;
};

// ✅ Update existing course (supports thumbnail)
export const updateCourse = async (courseId, courseData) => {
  const formData = new FormData();

  Object.entries(courseData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      formData.append(key, value);
    }
  });

  const response = await api.put(`/courses/${courseId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

// ✅ Publish course
export const publishCourse = async (courseId) => {
  const response = await api.patch(`/courses/${courseId}/publish`);
  return response.data;
};

// ✅ Republish course
export const republishCourse = async (courseId) => {
  const response = await api.patch(`/courses/${courseId}/republish`);
  return response.data;
};

// ✅ Save draft
export const saveDraft = async (courseData) => {
  if (courseData._id) {
    return await updateCourse(courseData._id, courseData);
  }
  return await createCourse(courseData);
};

// ✅ Get trainer's courses
export const getMyCourses = async () => {
  const response = await api.get("/courses/my-courses");
  return response.data;
};

// ✅ Get all courses
export const getAllCourses = async () => {
  const response = await api.get("/courses");
  return response.data;
};

// ✅ Student enrolled courses
export const getStudentCourses = async () => {
  const response = await api.get("/enrollments/my-courses");
  return response.data;
};
