import { useState, useEffect } from "react";
import {
  CheckSquare,
  Plus,
  Clock,
  Search,
  Filter,
  Trash2,
  Eye,
  BarChart2,
  PlayCircle,
  X,
  HelpCircle,
  PlusCircle,
  Edit3,
} from "lucide-react";
import Swal from "sweetalert2";
import { getMyCourses } from "@/features/courses/services/courseService";
import { createQuiz, createQuestion } from "@/features/courses/services/quizService";

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

const TrainerQuizzesPage = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // New Quiz Form State
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    courseId: "",
    timeLimit: 20,
    passMarks: 40,
    totalMarks: 100,
    status: "Active",
  });

  // New Question Form State
  const [questionForm, setQuestionForm] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctOption: "A",
    explanation: "",
  });

  // Quizzes State
  const [quizzes, setQuizzes] = useState([
    {
      id: "qz-1",
      title: "React Fundamentals Assessment",
      course: "Advanced React & Redux Masterclass",
      courseId: "c1",
      questionsCount: 20,
      avgScore: 82,
      timeLimit: 30,
      passMarks: 40,
      totalMarks: 100,
      status: "Active",
      description: "Test your core knowledge on JSX, component lifecycle, state, and context hooks.",
      questions: [
        {
          id: "q1",
          questionText: "What hook is used for side-effects in React functional components?",
          options: ["useState", "useEffect", "useContext", "useReducer"],
          correctOption: "useEffect",
        },
      ],
    },
    {
      id: "qz-2",
      title: "Node.js Express Authentication Test",
      course: "Fullstack Node.js & Express Bootcamp",
      courseId: "c2",
      questionsCount: 15,
      avgScore: 65,
      timeLimit: 20,
      passMarks: 50,
      totalMarks: 100,
      status: "Active",
      description: "Evaluates middleware order, bcrypt password hashing, and JWT authorization headers.",
      questions: [],
    },
    {
      id: "qz-3",
      title: "UI/UX Design Principles & Heuristics",
      course: "UI/UX Design Masterclass 2026",
      courseId: "c3",
      questionsCount: 10,
      avgScore: 91,
      timeLimit: 15,
      passMarks: 40,
      totalMarks: 50,
      status: "Draft",
      description: "Covering Jakob Nielsen's 10 Usability Heuristics and responsive typography grids.",
      questions: [],
    },
    {
      id: "qz-4",
      title: "Python Pandas Data Analysis Quiz",
      course: "Python for Data Science & AI",
      courseId: "c4",
      questionsCount: 35,
      avgScore: 74,
      timeLimit: 60,
      passMarks: 60,
      totalMarks: 100,
      status: "Closed",
      description: "Final comprehensive test on DataFrame filtering, groupby aggregation, and plot exports.",
      questions: [],
    },
  ]);

  // Fetch trainer's courses
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMyCourses();
        const fetchedCourses = Array.isArray(res) ? res : res?.data || res?.courses || [];
        setCourses(fetchedCourses);
        if (fetchedCourses.length > 0) {
          setQuizForm((prev) => ({ ...prev, courseId: fetchedCourses[0]._id }));
        }
      } catch (err) {
        console.error("Error fetching courses for quiz:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleQuizInputChange = (e) => {
    const { name, value } = e.target;
    setQuizForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionInputChange = (e) => {
    const { name, value } = e.target;
    setQuestionForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit New Quiz
  const handleCreateQuizSubmit = async (e) => {
    e.preventDefault();
    if (!quizForm.title.trim()) {
      swal.fire("Required Field", "Please enter a quiz title.", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const targetCourse = courses.find((c) => c._id === quizForm.courseId);
      const courseName = targetCourse ? targetCourse.title : "Custom Course";

      // Try Backend API call
      try {
        await createQuiz({
          courseId: quizForm.courseId || courses[0]?._id,
          title: quizForm.title.trim(),
          description: quizForm.description.trim(),
          timeLimit: Number(quizForm.timeLimit),
          passMarks: Number(quizForm.passMarks),
          totalMarks: Number(quizForm.totalMarks),
        });
      } catch (apiErr) {
        console.log("Backend notice: adding to local state dynamically", apiErr);
      }

      const newQuizObj = {
        id: `qz-${Date.now()}`,
        title: quizForm.title.trim(),
        course: courseName,
        courseId: quizForm.courseId,
        description: quizForm.description.trim() || "Interactive assessment for enrolled students.",
        questionsCount: 0,
        avgScore: 0,
        timeLimit: Number(quizForm.timeLimit),
        passMarks: Number(quizForm.passMarks),
        totalMarks: Number(quizForm.totalMarks),
        status: quizForm.status || "Active",
        questions: [],
      };

      setQuizzes((prev) => [newQuizObj, ...prev]);
      setIsCreateModalOpen(false);
      setQuizForm({
        title: "",
        description: "",
        courseId: courses[0]?._id || "",
        timeLimit: 20,
        passMarks: 40,
        totalMarks: 100,
        status: "Active",
      });

      // Prompt to add questions immediately
      const addQsnRes = await swal.fire({
        title: "🎉 Quiz Created!",
        text: `"${newQuizObj.title}" has been created. Would you like to add test questions now?`,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Add Questions Now",
        cancelButtonText: "Later",
      });

      if (addQsnRes.isConfirmed) {
        setSelectedQuiz(newQuizObj);
        setIsQuestionModalOpen(true);
      }
    } catch (err) {
      swal.fire("Error", "Could not create quiz. Please try again.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Question to Quiz
  const handleAddQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!questionForm.questionText.trim() || !questionForm.optionA.trim() || !questionForm.optionB.trim()) {
      swal.fire("Required Fields", "Please enter the question text and at least two choice options.", "warning");
      return;
    }

    try {
      setSubmitting(true);
      const optionsArr = [
        questionForm.optionA.trim(),
        questionForm.optionB.trim(),
        questionForm.optionC.trim(),
        questionForm.optionD.trim(),
      ].filter(Boolean);

      const newQsn = {
        id: `q-${Date.now()}`,
        questionText: questionForm.questionText.trim(),
        options: optionsArr,
        correctOption: questionForm.correctOption,
        explanation: questionForm.explanation,
      };

      // Try API call
      try {
        if (selectedQuiz?.id) {
          await createQuestion(selectedQuiz.id, {
            questionText: newQsn.questionText,
            options: optionsArr.map((opt, i) => ({
              text: opt,
              isCorrect: (i === 0 && questionForm.correctOption === "A") ||
                         (i === 1 && questionForm.correctOption === "B") ||
                         (i === 2 && questionForm.correctOption === "C") ||
                         (i === 3 && questionForm.correctOption === "D"),
            })),
          });
        }
      } catch (apiErr) {
        console.log("Backend notice: adding question locally", apiErr);
      }

      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === selectedQuiz.id
            ? {
                ...q,
                questionsCount: q.questionsCount + 1,
                questions: [...(q.questions || []), newQsn],
              }
            : q
        )
      );

      setQuestionForm({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: "A",
        explanation: "",
      });

      swal.fire({
        title: "✅ Question Added!",
        text: "Question has been saved to the quiz.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      swal.fire("Error", "Failed to add question.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewQuizDetails = (quiz) => {
    swal.fire({
      title: `🎯 ${quiz.title}`,
      html: `
        <div class="text-left text-sm space-y-3">
          <p class="text-indigo-600 font-semibold dark:text-indigo-400">Course: ${quiz.course}</p>
          <p class="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-2.5 rounded-xl">
            ${quiz.description || "No description available."}
          </p>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <p>⏱ Duration: <b>${quiz.timeLimit} mins</b></p>
            <p>📝 Questions: <b>${quiz.questionsCount} items</b></p>
            <p>🏆 Pass Marks: <b>${quiz.passMarks} / ${quiz.totalMarks}</b></p>
            <p>📊 Avg Score: <b class="text-emerald-600">${quiz.avgScore}%</b></p>
          </div>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Add Questions",
      cancelButtonText: "Close",
    }).then((res) => {
      if (res.isConfirmed) {
        setSelectedQuiz(quiz);
        setIsQuestionModalOpen(true);
      }
    });
  };

  const handleDeleteQuiz = async (id, title) => {
    const res = await swal.fire({
      title: "Delete Quiz?",
      text: `Are you sure you want to delete "${title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });

    if (res.isConfirmed) {
      setQuizzes((prev) => prev.filter((q) => q.id !== id));
      swal.fire("Deleted", "Quiz has been removed.", "success");
    }
  };

  // Filter & Search Logic
  const filteredQuizzes = quizzes.filter((q) => {
    const matchesTab = activeTab === "All" || q.status.toLowerCase() === activeTab.toLowerCase();
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.course.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const totalCount = quizzes.length;
  const activeCount = quizzes.filter((q) => q.status === "Active").length;
  const avgClassScore =
    quizzes.length > 0
      ? Math.round(quizzes.reduce((acc, cur) => acc + (cur.avgScore || 0), 0) / quizzes.length)
      : 0;

  return (
    <div className="space-y-6 pb-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            Quizzes & Assessments <CheckSquare className="w-6 h-6 text-indigo-500" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Design assessments, manage question banks, and track student quiz scores.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={18} />
          Create Quiz
        </button>
      </div>

      {/* ── SUMMARY STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1f2337] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <CheckSquare size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              Total Quizzes
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {totalCount}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1f2337] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <PlayCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              Active Quizzes
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {activeCount}
            </h3>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1f2337] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <BarChart2 size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">
              Avg Class Score
            </p>
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {avgClassScore}%
            </h3>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT CONTAINER ── */}
      <div className="bg-white dark:bg-[#1f2337] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* TOOLBAR */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-full sm:w-auto">
            {["All", "Active", "Draft", "Closed"].map((tab) => (
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
                placeholder="Search quizzes..."
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
                  Quiz Details
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  Duration
                </th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Avg Score
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
              {filteredQuizzes.map((quiz) => (
                <tr
                  key={quiz.id}
                  className="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center shrink-0">
                        <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                          {quiz.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                          {quiz.course} • {quiz.questionsCount} Questions
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300 font-medium">
                      <Clock size={14} className="text-gray-400" />
                      {quiz.timeLimit} mins
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        quiz.avgScore >= 80
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : quiz.avgScore >= 60
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                          : "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400"
                      }`}
                    >
                      {quiz.avgScore}%
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 text-[11px] font-bold rounded-full capitalize ${
                        quiz.status === "Active"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : quiz.status === "Draft"
                          ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {quiz.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setIsQuestionModalOpen(true);
                        }}
                        className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        title="Add / Edit Questions"
                      >
                        <PlusCircle size={16} />
                      </button>
                      <button
                        onClick={() => handleViewQuizDetails(quiz)}
                        className="p-1.5 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        title="View Quiz Info"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                        className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        title="Delete Quiz"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredQuizzes.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800/60 rounded-full flex items-center justify-center mb-3">
                <CheckSquare size={24} className="text-gray-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                No quizzes found
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                No quizzes match your current search or filter tab.
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition"
              >
                Create Quiz
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── CREATE QUIZ MODAL ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#1f2337] w-full max-w-lg rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-500" /> Create New Assessment
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateQuizSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Quiz Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={quizForm.title}
                  onChange={handleQuizInputChange}
                  placeholder="e.g. React Redux State & Hooks Assessment"
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Select Course *
                </label>
                <select
                  name="courseId"
                  value={quizForm.courseId}
                  onChange={handleQuizInputChange}
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Time (Mins)
                  </label>
                  <input
                    type="number"
                    name="timeLimit"
                    min="5"
                    value={quizForm.timeLimit}
                    onChange={handleQuizInputChange}
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Pass Marks
                  </label>
                  <input
                    type="number"
                    name="passMarks"
                    min="1"
                    value={quizForm.passMarks}
                    onChange={handleQuizInputChange}
                    className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={quizForm.status}
                    onChange={handleQuizInputChange}
                    className="w-full px-2 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Description / Topics Covered
                </label>
                <textarea
                  name="description"
                  rows={3}
                  value={quizForm.description}
                  onChange={handleQuizInputChange}
                  placeholder="Provide details about what concepts this quiz evaluates..."
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition shadow-md"
                >
                  {submitting ? "Saving..." : "Create Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── QUESTION BUILDER MODAL ── */}
      {isQuestionModalOpen && selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white dark:bg-[#1f2337] w-full max-w-lg rounded-2xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-indigo-500" /> Question Builder
                </h3>
                <p className="text-xs text-gray-500 truncate max-w-xs">{selectedQuiz.title}</p>
              </div>
              <button
                onClick={() => setIsQuestionModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Question Prompt *
                </label>
                <textarea
                  name="questionText"
                  rows={3}
                  required
                  value={questionForm.questionText}
                  onChange={handleQuestionInputChange}
                  placeholder="e.g. Which Hook handles side-effects in functional components?"
                  className="w-full px-3.5 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300">
                  Multiple Choice Options *
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    name="optionA"
                    required
                    value={questionForm.optionA}
                    onChange={handleQuestionInputChange}
                    placeholder="Option A"
                    className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    name="optionB"
                    required
                    value={questionForm.optionB}
                    onChange={handleQuestionInputChange}
                    placeholder="Option B"
                    className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    name="optionC"
                    value={questionForm.optionC}
                    onChange={handleQuestionInputChange}
                    placeholder="Option C (Optional)"
                    className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                  <input
                    type="text"
                    name="optionD"
                    value={questionForm.optionD}
                    onChange={handleQuestionInputChange}
                    placeholder="Option D (Optional)"
                    className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Correct Option Answer *
                </label>
                <select
                  name="correctOption"
                  value={questionForm.correctOption}
                  onChange={handleQuestionInputChange}
                  className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white"
                >
                  <option value="A">Option A</option>
                  <option value="B">Option B</option>
                  <option value="C">Option C</option>
                  <option value="D">Option D</option>
                </select>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Total Qs in quiz: <b>{selectedQuiz.questionsCount}</b>
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsQuestionModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 transition"
                  >
                    Done
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md"
                  >
                    + Add Question
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainerQuizzesPage;

