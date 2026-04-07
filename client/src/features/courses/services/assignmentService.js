import api from "@/services/api";

export const createAssignment = async (assignmentData) => {
  try {
    const response = await api.post("/assignments", assignmentData);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating assignment:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get all assignments for student from enrolled courses
 */
export const getStudentAssignments = async () => {
  try {
    const response = await api.get("/assignments/my-assignments");
    return response.data.data;
  } catch (error) {
    console.error(
      "Error fetching student assignments:",
      error.response?.data || error.message
    );
    throw error;
  }
};
