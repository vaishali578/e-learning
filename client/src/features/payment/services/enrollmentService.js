import api from "../../../services/api";

// ✅ Confirm payment & enroll student
export const enrollCourse = async (courseId, paymentIntentId) => {
  if (!courseId || !paymentIntentId) {
    throw new Error("courseId or paymentIntentId missing");
  }

  const response = await api.post("/payments/confirm", {
    courseId,
    paymentIntentId,
  });

  return response.data;
};

// ✅ Get student's enrollments
export const getMyEnrollments = async () => {
  const response = await api.get("/enrollments/my");
  return response.data;
};
