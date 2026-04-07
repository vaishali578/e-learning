import { useState, useEffect } from "react";
import { FiX, FiLoader } from "react-icons/fi";
import Swal from "sweetalert2";
import { createSchedule } from "@/features/schedule/services/scheduleService";
import { getMyCourses } from "@/features/courses/services/courseService";

const DAYS_OF_WEEK = [
  { value: 0, label: "Sun" },
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
];

const RECURRENCE_PATTERNS = [
  { value: "none", label: "No Recurrence" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

const PLATFORM_TYPES = [
  { value: "none", label: "No Meeting Link" },
  { value: "zoom", label: "Zoom" },
  { value: "meet", label: "Google Meet" },
  { value: "teams", label: "Microsoft Teams" },
  { value: "custom", label: "Custom Platform" },
];

export default function CreateScheduleModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    topic: "",
    course: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    duration: 60,
    meetingLink: "",
    platformType: "none",
    location: "",
    isRecurring: false,
    recurrencePattern: "none",
    daysOfWeek: [],
    recurrenceEndDate: "",
    maxCapacity: "",
  });

  // Fetch courses on mount
  useEffect(() => {
    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const response = await getMyCourses();
      console.log("Full courses response:", response);
      
      // Extract courses from response
      let coursesList = [];
      if (Array.isArray(response)) {
        // Direct array
        coursesList = response;
      } else if (response?.data) {
        if (Array.isArray(response.data)) {
          // { data: [...] }
          coursesList = response.data;
        } else if (response.data?.courses && Array.isArray(response.data.courses)) {
          // { data: { courses: [...] } }
          coursesList = response.data.courses;
        } else if (Array.isArray(response.data)) {
          coursesList = response.data;
        }
      } else if (response?.courses && Array.isArray(response.courses)) {
        // { courses: [...] }
        coursesList = response.courses;
      }
      
      console.log("Extracted courses:", coursesList);
      setCourses(coursesList || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to Load Courses",
        text: err.message || "Unable to fetch your courses. Please try again.",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setCoursesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Title",
        text: "Schedule title is required",
        confirmButtonColor: "#3b82f6",
      });
      return false;
    }
    if (!formData.topic.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Topic",
        text: "Topic is required",
        confirmButtonColor: "#3b82f6",
      });
      return false;
    }
    if (!formData.course) {
      Swal.fire({
        icon: "warning",
        title: "No Course Selected",
        text: "Please select a course",
        confirmButtonColor: "#3b82f6",
      });
      return false;
    }
    if (!formData.startDate || !formData.startTime) {
      Swal.fire({
        icon: "warning",
        title: "Missing Start Time",
        text: "Start date and time are required",
        confirmButtonColor: "#3b82f6",
      });
      return false;
    }
    if (!formData.endDate || !formData.endTime) {
      Swal.fire({
        icon: "warning",
        title: "Missing End Time",
        text: "End date and time are required",
        confirmButtonColor: "#3b82f6",
      });
      return false;
    }

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (startDateTime >= endDateTime) {
      Swal.fire({
        icon: "error",
        title: "Invalid Time Range",
        text: "End time must be after start time",
        confirmButtonColor: "#3b82f6",
      });
      return false;
    }

    if (formData.isRecurring && !formData.recurrenceEndDate) {
      Swal.fire({
        icon: "warning",
        title: "Missing Recurrence End Date",
        text: "Recurrence end date is required for recurring schedules",
        confirmButtonColor: "#3b82f6",
      });
      return false;
    }

    if (formData.platformType !== "none" && !formData.meetingLink.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing Meeting Link",
        text: "Meeting link is required when platform type is selected",
        confirmButtonColor: "#3b82f6",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const payload = {
        title: formData.title,
        description: formData.description,
        topic: formData.topic,
        course: formData.course,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        duration: parseInt(formData.duration),
        meetingLink: formData.meetingLink || "",
        platformType: formData.platformType,
        location: formData.location || "",
        isRecurring: formData.isRecurring,
        recurrencePattern: formData.isRecurring ? formData.recurrencePattern : "none",
        daysOfWeek: formData.isRecurring ? formData.daysOfWeek : [],
        recurrenceEndDate: formData.isRecurring ? formData.recurrenceEndDate : null,
        maxCapacity: formData.maxCapacity ? parseInt(formData.maxCapacity) : null,
      };

      const response = await createSchedule(payload);

      if (response?.success || response?._id) {
        Swal.fire({
          icon: "success",
          title: "Schedule Created",
          text: "Your schedule has been created successfully!",
          confirmButtonColor: "#3b82f6",
          timer: 2000,
        });
        // Reset form
        setFormData({
          title: "",
          description: "",
          topic: "",
          course: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          duration: 60,
          meetingLink: "",
          platformType: "none",
          location: "",
          isRecurring: false,
          recurrencePattern: "none",
          daysOfWeek: [],
          recurrenceEndDate: "",
          maxCapacity: "",
        });
        setTimeout(() => {
          onClose();
          onSuccess?.();
        }, 2000);
      } else {
        Swal.fire({
          icon: "error",
          title: "Creation Failed",
          text: response?.message || "Failed to create schedule",
          confirmButtonColor: "#3b82f6",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "Failed to create schedule",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create Schedule
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Set up a new course schedule for your students
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <FiX size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., React Basics Session"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Topic *
                  </label>
                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="e.g., Component Lifecycle"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Add details about this session"
                    rows="2"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course * {coursesLoading && <span className="text-xs text-blue-600">Loading...</span>}
                  </label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    disabled={coursesLoading || courses.length === 0}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm disabled:opacity-50"
                  >
                    <option value="">
                      {coursesLoading ? "Loading courses..." : courses.length === 0 ? "No courses available" : "Select a course"}
                    </option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.name}
                      </option>
                    ))}
                  </select>
                  {courses.length === 0 && !coursesLoading && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                      You need to create a course first to create schedules.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Date & Time
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Meeting Details */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Meeting Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Platform Type
                  </label>
                  <select
                    name="platformType"
                    value={formData.platformType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  >
                    {PLATFORM_TYPES.map((platform) => (
                      <option key={platform.value} value={platform.value}>
                        {platform.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.platformType !== "none" && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Meeting Link *
                    </label>
                    <input
                      type="url"
                      name="meetingLink"
                      value={formData.meetingLink}
                      onChange={handleChange}
                      placeholder="https://zoom.us/j/..."
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Room 101 or N/A"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Recurrence */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                />
                <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                  Recurring schedule
                </span>
              </label>

              {formData.isRecurring && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pattern
                    </label>
                    <select
                      name="recurrencePattern"
                      value={formData.recurrencePattern}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    >
                      {RECURRENCE_PATTERNS.filter((p) => p.value !== "none").map(
                        (pattern) => (
                          <option key={pattern.value} value={pattern.value}>
                            {pattern.label}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {(formData.recurrencePattern === "weekly" ||
                    formData.recurrencePattern === "biweekly") && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Days
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {DAYS_OF_WEEK.map((day) => (
                          <label
                            key={day.value}
                            className="flex items-center gap-1 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.daysOfWeek.includes(day.value)}
                              onChange={() => handleDayToggle(day.value)}
                              className="w-3 h-3 rounded border-gray-300 text-blue-600 cursor-pointer"
                            />
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                              {day.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date *
                    </label>
                    <input
                      type="date"
                      name="recurrenceEndDate"
                      value={formData.recurrenceEndDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <FiLoader size={14} className="animate-spin" />
                Creating...
              </>
            ) : (
              "Create Schedule"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
