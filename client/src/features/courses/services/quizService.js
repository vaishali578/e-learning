import api from "@/services/api";

// 🔹 Create Quiz
export const createQuiz = async (quizData) => {
  try {
    const response = await api.post("/quizzes", quizData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔹 Create Question (QSN)
export const createQuestion = async (quizId, questionData) => {
  try {
    const response = await api.post(`/quizzes/${quizId}/questions`, questionData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🔹 Publish Course
export const publishCourse = async (courseId) => {
  try {
    const response = await api.patch(`/courses/${courseId}/publish`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all quizzes for student from enrolled courses
 */
export const getStudentQuizzes = async () => {
  try {
    const response = await api.get("/quizzes/my-quizzes");
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching student quizzes:",
      error.response?.data || error.message
    );
    throw error;
  }
};
