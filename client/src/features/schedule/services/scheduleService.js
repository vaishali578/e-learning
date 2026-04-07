import api from "@/services/api";

// Get schedules for a student
export const getStudentSchedules = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.upcoming) params.append("upcoming", "true");

    const response = await api.get(`/schedules/student/my${params ? `?${params}` : ""}`);
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch schedules";
  }
};

// Get schedules for a course
export const getCourseSchedules = async (courseId, filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.startDate) params.append("startDate", filters.startDate);

    const response = await api.get(`/schedules/course/${courseId}${params ? `?${params}` : ""}`);
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch course schedules";
  }
};

// Get trainer schedules
export const getTrainerSchedules = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.status) params.append("status", filters.status);
    if (filters.startDate) params.append("startDate", filters.startDate);

    const response = await api.get(`/schedules/trainer/my${params ? `?${params}` : ""}`);
    return response.data?.data || [];
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch trainer schedules";
  }
};

// Get schedule details
export const getScheduleDetails = async (scheduleId) => {
  try {
    const response = await api.get(`/schedules/${scheduleId}`);
    return response.data?.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch schedule details";
  }
};

// Create schedule (trainer)
export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post("/schedules", scheduleData);
    return response.data?.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to create schedule";
  }
};

// Update schedule (trainer)
export const updateSchedule = async (scheduleId, updates) => {
  try {
    const response = await api.put(`/schedules/${scheduleId}`, updates);
    return response.data?.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update schedule";
  }
};

// Delete schedule (trainer)
export const deleteSchedule = async (scheduleId) => {
  try {
    const response = await api.delete(`/schedules/${scheduleId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete schedule";
  }
};

// RSVP to schedule (student)
export const rsvpToSchedule = async (scheduleId, status) => {
  try {
    const response = await api.post(`/schedules/${scheduleId}/rsvp`, { status });
    return response.data?.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update RSVP";
  }
};

// Mark attendance (trainer)
export const markAttendance = async (scheduleId, studentId, status) => {
  try {
    const response = await api.post(
      `/schedules/${scheduleId}/attendance/${studentId}`,
      { status }
    );
    return response.data?.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to mark attendance";
  }
};

// Cancel schedule (trainer)
export const cancelSchedule = async (scheduleId, reason = "") => {
  try {
    const response = await api.post(`/schedules/${scheduleId}/cancel`, { reason });
    return response.data?.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to cancel schedule";
  }
};
