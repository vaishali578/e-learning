import api from "@/services/api";

export const uploadLessonVideo = async (formData) => {
  const res = await api.post(
    "/uploads/video",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
};
