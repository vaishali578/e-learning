import api from "@/services/api";

export const createSection = async (courseId, sectionData) => {
  try {
    const response = await api.post("/sections", {
      courseId,
      ...sectionData,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating section:", error.response || error);
    throw error;
  }
};

export const deleteSection = async (sectionId, courseId) => {
  try {
    const response = await api.delete(`/sections/${sectionId}`, {
      params: { courseId },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting section:", error.response || error);
    throw error;
  }
};

/* ===================== UPDATE SECTION ===================== */
export const updateSection = async (sectionId, title) => {
  try {
    const response = await api.patch(`/sections/${sectionId}`, {
      title,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating section:", error.response || error);
    throw error;
  }
};