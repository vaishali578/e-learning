import api from "@/services/api";

export const createLesson = async (lessonData) => {
  try {
    const response = await api.post("/lessons", lessonData);
    return response.data;  
  } catch (error) {
    console.error("Error creating lesson:", error.response?.data || error.message);
    throw error; 
  }
};