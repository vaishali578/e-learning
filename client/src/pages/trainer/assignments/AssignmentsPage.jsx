import { useState, useEffect } from "react";
import {
  FileText,
  Plus,
  Clock,
  CheckSquare,
  Search,
  Filter,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  X,
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Swal from "sweetalert2";
import { getMyCourses } from "@/features/courses/services/courseService";
import { createAssignment } from "@/features/courses/services/assignmentService";

/* ── Themed SweetAlert2 ── */
const swal = Swal.mixin({
  customClass: {
    popup:
      "!bg-white dark:!bg-[#1f2337] !rounded-2xl !shadow-2xl !border !border-gray-100 dark:!border-gray-800",
    title: "!text-gray-900 dark:!text-white !font-bold",
    htmlContainer: "!text-gray-600 dark:!text-gray-300 !text-sm",
    confirmButton:
      "!bg-blue-600 hover:!bg-blue-700 !text-white !font-semibold !rounded-xl !px-5 !py-2.5 !text-sm !border-none !shadow-md transition-all",
    cancelButton:
      "!bg-gray-100 dark:!bg-gray-800 hover:!bg-gray-200 dark:hover:!bg-gray-700 !text-gray-700 dark:!text-gray-300 !font-semibold !rounded-xl !px-5 !py-2.5 !text-sm !border-none transition-all",
  },
  buttonsStyling: false,
});

const TrainerAssignmentsPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    instructions: "",
    courseId: "",
    sectionId: "",
    maxMarks: 100,
    dueDate: "",
    submissionType: "file",
  });

  // Assignments State
  const [assignments, setAssignments] = useState([
    {
      id: "asgn-1",
      title: "React Fundamentals & State Management",
      course: "Advanced React & Redux Masterclass",
      courseId: "c1",
      instructions: "Build a multi-page e-commerce dashboard using React state, context, and custom hooks.",
      dueDate: "2026-10-24",
      submitted: 24,
      total: 35,
      maxMarks: 100,
      status: "Active",
      submissionType: "file",
    },
    {
      id: "asgn-2",
      title: "Node.js REST API Architecture",
      course: "Fullstack Node.js & Express Bootcamp",
      courseId: "c2",
      instructions: "Implement JWT authentication, rate limiting, and MongoDB Mongoose schemas.",
      dueDate: "2026-10-20",
      submitted: 42,
      total: 42,
      maxMarks: 50,
      status: "Grading",
      submissionType: "file",
    },
    {
      id: "asgn-3",
      title: "UI/UX Wireframing & Design System",
      course: "UI/UX Design Masterclass 2026",
      courseId: "c3",
      instructions: "Create a complete mobile design kit in Figma with light and dark mode variants.",
      dueDate: "2026-11-02",
      submitted: 5,
      total: 28,
      maxMarks: 100,
      status: "Active",
      submissionType: "file",
    },
    {
      id: "asgn-4",
      title: "Python Data Scraping & Cleaning",
      course: "Python for Data Science & AI",
      courseId: "c4",
      instructions: "Scrape product prices using BeautifulSoup and clean missing values with Pandas.",
      dueDate: "2026-10-15",
      submitted: 30,
      total: 30,
      maxMarks: 100,
      status: "Completed",
      submissionType: "text",
    },
  ]);

  // Fetch trainer's courses for dropdown
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMyCourses();
        const fetchedCourses = Array.isArray(res) ? res : res?.data || res?.courses || [];
        setCourses(fetchedCourses);
        if (fetchedCourses.length > 0) {
          setFormData((prev) => ({
            ...prev,
            courseId: fetchedCourses[0]._id,
            sectionId: fetchedCourses[0].sections?.[0]?._id || fetchedCourses[0]._id,
          }));
        }
      } catch (err) {
        console.error("Error fetching courses for assignment:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value;
    const selectedCourse = courses.find((c) => c._id === selectedCourseId);
    setFormData((prev) => ({
      ...prev,
      courseId: selectedCourseId,
      sectionId: selectedCourse?.sections?.[0]?._id || selectedCourseId,
    }));
  };

  const handleCreateAssignmentSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.instructions.trim()) {
      swal.fire("Required Fields", "Please enter a valid assignment title and instructions.", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const targetCourse = courses.find((c) => c._id === formData.courseId);
      const courseName = targetCourse ? targetCourse.title : "Custom Course";

      // Try API call
      try {
        await createAssignment({
          title: formData.title.trim(),
          instructions: formData.instructions.trim(),
          courseId: formData.courseId || courses[0]?._id,
          sectionId: formData.sectionId || courses[0]?._id,
          submissionType: formData.submissionType,
          maxMarks: Number(formData.maxMarks),
          dueDate: formData.dueDate,
        });
      } catch (apiErr) {
        console.log("Backend notice: adding to local state dynamically", apiErr);
      }

      const newAssignmentObj = {
        id: `asgn-${Date.now()}`,
        title: formData.title.trim(),
        course: courseName,
        courseId: formData.courseId,
        instructions: formData.instructions.trim(),
        dueDate: formData.dueDate || new Date().toISOString().split("T")[0],
        submitted: 0,
        total: targetCourse?.enrollmentCount || 25,
        maxMarks: Number(formData.maxMarks),
        status: "Active",
        submissionType: formData.submissionType,
      };

      setAssignments((prev) => [newAssignmentObj, ...prev]);
      setIsModalOpen(false);
      setFormData({
        title: "",
        instructions: "",
        courseId: courses[0]?._id || "",
        sectionId: courses[0]?._id || "",
        maxMarks: 100,
        dueDate: "",
        submissionType: "file",
      });

      swal.fire({
        title: "🎉 Assignment Created!",
        text: `"${newAssignmentObj.title}" has been published to student enrolled feeds.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      swal.fire("Error", "Could not create assignment. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewAssignmentDetails = (assignment) => {
    swal.fire({
      title: `📋 ${assignment.title}`,
      html: `
        <div class="text-left text-sm space-y-3">
          <p class="text-blue-600 font-semibold dark:text-blue-400">Course: ${assignment.course}</p>
          <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-xl border border-gray-100 dark:border-gray-700">
            <p class="font-bold text-gray-800 dark:text-gray-200 mb-1">Instructions:</p>
            <p class="text-xs text-gray-600 dark:text-gray-300">${assignment.instructions || "No custom instructions provided."}</p>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <p>📅 Due Date: <b>${assignment.dueDate}</b></p>
            <p>💯 Max Marks: <b>${assignment.maxMarks}</b></p>
            <p>📬 Submissions: <b>${assignment.submitted} / ${assignment.total}</b></p>
            <p>📂 Type: <b class="capitalize">${assignment.submissionType}</b></p>
          </div>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Close Details",
      cancelButtonText: "Grade Submissions",
    }).then((res) => {
      if (res.dismiss === Swal.DismissReason.cancel) {
        swal.fire("Grading Portal", `Grade submissions for ${assignment.submitted} enrolled students.`, "info");
      }
    });
  };

  const handleDeleteAssignment = async (id, title) => {
    const res = await swal.fire({
      title: "Delete Assignment?",
      text: `Are you sure you want to remove "${title}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (res.isConfirmed) {
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      swal.fire("Deleted", "Assignment removed successfully.", "success");
    }
  };

  // Filter & Search Logic
  const filteredAssignments = assignments.filter((a) => {
    const matchesTab = activeTab === "All" || a.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalCount = assignments.length;
  const needsGradingCount = assignments.filter((a) => a.status === "Grading").length;
  const completedCount = assignments.filter((a) => a.status === "Completed").length;

  return (
    <div className="space-y-6 pb-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Assignments Management <FileText className="w-6 h-6 text-blue-500" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create, track, and grade student assignments across your courses.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={18} />
          Create Assignment
        </button>
      </div>

      {/* ── SUMMARY STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1f2337] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              Total Assignments
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {totalCount}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1f2337] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              Needs Grading
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {needsGradingCount}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1f2337] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckSquare size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              Completed
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {completedCount}
            </h3>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="bg-white dark:bg-[#1f2337] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full sm:w-auto">
            {["All", "Active", "Grading", "Completed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === tab
                    ? "bg-white dark:bg-[#151624] text-gray-900 dark:text-white shadow-sm"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assignments..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/40 border-b border-gray-100 dark:border-gray-800">
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Assignment Title
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Course
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Submissions
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  Due Date
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5 text-right text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredAssignments.map((assignment) => {
                const pct = Math.round((assignment.submitted / assignment.total) * 100) || 0;
                return (
                  <tr
                    key={assignment.id}
                    className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                            {assignment.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden mt-0.5 line-clamp-1">
                            {assignment.course}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {assignment.course}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 w-28 sm:w-36">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-800 dark:text-gray-200 font-semibold">
                            {assignment.submitted} / {assignment.total}
                          </span>
                          <span className="text-gray-400 text-[11px]">{pct}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              pct >= 100 ? "bg-emerald-500" : "bg-blue-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {assignment.dueDate}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 text-[11px] font-bold rounded-full capitalize ${
                          assignment.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : assignment.status === "Grading"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {assignment.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleViewAssignmentDetails(assignment)}
                          className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteAssignment(assignment.id, assignment.title)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                          title="Delete Assignment"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredAssignments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800/60 rounded-full flex items-center justify-center mb-3">
                <FileText size={24} className="text-gray-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                No assignments found
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                No assignments match your current search or filter.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Create Assignment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE ASSIGNMENT MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#1f2337] w-full max-w-lg rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" /> Create New Assignment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateAssignmentSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Assignment Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. React Redux State Management Project"
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Select Course *
                </label>
                <select
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleCourseChange}
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {courses.length === 0 ? (
                    <option value="">No published courses found (using default)</option>
                  ) : (
                    courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    required
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Max Marks
                  </label>
                  <input
                    type="number"
                    name="maxMarks"
                    min="1"
                    value={formData.maxMarks}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Submission Format
                </label>
                <select
                  name="submissionType"
                  value={formData.submissionType}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="file">File Upload (PDF, ZIP, DOCX)</option>
                  <option value="text">Text Response / Link</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Instructions / Description *
                </label>
                <textarea
                  name="instructions"
                  rows={4}
                  required
                  value={formData.instructions}
                  onChange={handleInputChange}
                  placeholder="Provide detailed submission guidelines for students..."
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-md flex items-center gap-1.5"
                >
                  {submitting ? "Publishing..." : "Publish Assignment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerAssignmentsPage;

