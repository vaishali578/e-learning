import api from "../../../services/api";

/**
 * Get full course player data
 */
export const getCoursePlayerData = async (courseId) => {
  const res = await api.get(`/courses/${courseId}/player`);
  return res.data.data;
};

/**
 * Get single lesson detail
 */
export const getLessonById = async (lessonId) => {
  const res = await api.get(`/lessons/${lessonId}`);
  return res.data.data;
};

/**
 * ✅ Get quiz for student
 */
export const getQuizById = async (quizId) => {
  const res = await api.get(`/quizzes/${quizId}`);
  console.log(res)
  return res.data.data;
};

/**
 * ✅ Get quiz with answers (for results)
 */
export const getQuizResultsById = async (quizId) => {
  const res = await api.get(`/quizzes/${quizId}/results`);
  return res.data.data;
};
