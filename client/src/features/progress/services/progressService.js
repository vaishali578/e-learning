import api from "@/services/api";

/* ===============================
   MARK ITEM COMPLETE
================================= */
export const markItemComplete = async ({
  courseId,
  itemId,
  itemType,
}) => {
  try {
    const response = await api.post(
      "/course-progress/complete",
      {
        courseId,
        itemId,
        itemType,
      }
    );

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};


/* ===============================
   GET COURSE PROGRESS
================================= */
export const getCourseProgress = async (courseId) => {
  try {
    const response = await api.get(
      `/course-progress/${courseId}`
    );

    console.log(response)

    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};