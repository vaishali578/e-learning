import { useEffect, useState } from "react";
import {
  FiPlay,
  FiBookOpen,
  FiAward,
  FiCheckSquare,
  FiArrowRight,
  FiCalendar,
  FiVideo,
  FiAlertCircle,
  FiTrendingUp,
  FiClock,
} from "react-icons/fi";
import Swal from "sweetalert2";
import { getUserName } from "@/utils/getUser";
import { getStudentCourses } from "@/features/courses/services/courseService";
import { getStudentAssignments } from "@/features/courses/services/assignmentService";
import { getStudentQuizzes } from "@/features/courses/services/quizService";
import { useNavigate } from "react-router-dom";

/* ── helpers ── */
const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
    : null;

/* ── Themed SweetAlert2 fire wrapper ── */
const swal = Swal.mixin({
  customClass: {
    popup:
      "!bg-white dark:!bg-[#1f2337] !rounded-2xl !shadow-2xl !border !border-gray-100",
    title: "!text-gray-900 !font-bold",
    htmlContainer: "!text-gray-500 !text-sm",
    confirmButton:
      "!bg-blue-600 hover:!bg-blue-700 !text-white !font-semibold !rounded-xl !px-5 !py-2 !text-sm !border-none",
    cancelButton:
      "!bg-gray-100 hover:!bg-gray-200 !text-gray-700 !font-semibold !rounded-xl !px-5 !py-2 !text-sm !border-none",
    denyButton:
      "!bg-red-100 hover:!bg-red-200 !text-red-700 !font-semibold !rounded-xl !px-5 !py-2 !text-sm !border-none",
  },
  buttonsStyling: false,
  showClass: { popup: "animate__animated animate__fadeInDown animate__faster" },
  hideClass: { popup: "animate__animated animate__fadeOutUp animate__faster" },
});

/* ════════════════════════════════════════
   StudentDashboard
════════════════════════════════════════ */
const StudentDashboard = () => {
  const name     = getUserName();
  const navigate = useNavigate();

  const [courses,     setCourses]     = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes,     setQuizzes]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState("Today");

  useEffect(() => {
    (async () => {
      try {
        const [cRes, aRes, qRes] = await Promise.allSettled([
          getStudentCourses(),
          getStudentAssignments(),
          getStudentQuizzes(),
        ]);

        const enrolled =
          cRes.status === "fulfilled"
            ? (cRes.value?.data ?? []).map((e) => ({
                ...(e.course ?? {}),
                progressPercentage: e.progressPercentage ?? 0,
              }))
            : [];

        setCourses(enrolled);
        setAssignments(aRes.status === "fulfilled" ? aRes.value ?? [] : []);

        const qVal = qRes.status === "fulfilled" ? qRes.value ?? {} : {};
        setQuizzes([
          ...(qVal.active ?? []).map((q) => ({ ...q, completed: false })),
          ...(qVal.completed ?? []).map((q) => ({ ...q, completed: true })),
        ]);
      } catch (_) {
        /* silently skip */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── derived ── */
  const total   = courses.length;
  const done    = courses.filter((c) => c.progressPercentage === 100).length;
  const pending = assignments.filter((a) => a.status !== "submitted");
  const avgPct  =
    total > 0
      ? Math.round(courses.reduce((s, c) => s + (c.progressPercentage || 0), 0) / total)
      : 0;
  const resume =
    courses.find((c) => c.progressPercentage > 0 && c.progressPercentage < 100) ??
    courses[0] ??
    null;

  /* ── Action handlers (all with SweetAlert) ── */

  const handleResumeCourse = async (course) => {
    const result = await swal.fire({
      title: "▶ Resume Course",
      html: `<b>${course.title}</b><br/><span class="text-xs text-gray-400 font-medium">Progress: ${course.progressPercentage}% complete</span>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Continue Learning",
      cancelButtonText: "Not now",
    });
    if (result.isConfirmed) navigate(`/student/courses/${course._id}`);
  };

  const handleOpenCourse = async (course) => {
    const p = course.progressPercentage ?? 0;
    const isNew = p === 0;
    const isDone = p === 100;

    const result = await swal.fire({
      title: isDone ? "✅ Course Completed!" : isNew ? "🚀 Start Learning" : "📖 Continue Learning",
      html: `<b>${course.title}</b><br/><span class="text-xs">${isDone ? "Review the course material anytime." : `${p}% completed`}</span>`,
      icon: isDone ? "success" : "info",
      showCancelButton: true,
      confirmButtonText: isDone ? "Review Course" : isNew ? "Start Now" : "Continue",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) navigate(`/student/courses/${course._id}`);
  };

  const handleViewAllCourses = async () => {
    const result = await swal.fire({
      title: "📚 My Courses",
      html: `You have <b>${total}</b> enrolled course${total !== 1 ? "s" : ""}. View them all?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Go to My Courses",
      cancelButtonText: "Stay here",
    });
    if (result.isConfirmed) navigate("/student/my-courses");
  };

  const handleExploreCourses = async () => {
    const result = await swal.fire({
      title: "🔍 Explore Courses",
      text: "Browse hundreds of courses and enroll in the ones that interest you.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Explore Now",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) navigate("/student/explore-courses");
  };

  const handleViewAllAssignments = async () => {
    const overdueCount = pending.filter(
      (a) => a.dueDate && new Date(a.dueDate) < new Date()
    ).length;
    const result = await swal.fire({
      title: "📋 Assignments",
      html: `You have <b>${pending.length}</b> pending task${pending.length !== 1 ? "s" : ""}${
        overdueCount > 0 ? ` (<b class="text-red-600">${overdueCount} overdue</b>)` : ""
      }.`,
      icon: overdueCount > 0 ? "warning" : "info",
      showCancelButton: true,
      confirmButtonText: "View All Tasks",
      cancelButtonText: "Stay here",
    });
    if (result.isConfirmed) navigate("/student/assignments");
  };

  const handleAttemptQuiz = async (quiz) => {
    const result = await swal.fire({
      title: "🎯 Attempt Quiz",
      html: `
        <b>${quiz.title}</b><br/>
        <span class="text-xs text-gray-400">${quiz.course?.title ?? "General"}</span><br/><br/>
        <div class="text-left text-sm space-y-1">
          <p>⏱ Time limit: <b>${quiz.timeLimit ?? "N/A"} mins</b></p>
          <p>📝 Total marks: <b>${quiz.totalMarks ?? "N/A"}</b></p>
          <p>✅ Pass marks: <b>${quiz.passMarks ?? "N/A"}</b></p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Start Quiz",
      cancelButtonText: "Not now",
    });
    if (result.isConfirmed) navigate("/student/quizzes");
  };

  const handleViewAllQuizzes = async () => {
    const activeCount = quizzes.filter((q) => !q.completed).length;
    const result = await swal.fire({
      title: "📝 Quizzes",
      html: `You have <b>${activeCount}</b> upcoming quiz${activeCount !== 1 ? "zes" : ""} and <b>${quizzes.length - activeCount}</b> completed.`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "View All Quizzes",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) navigate("/student/quizzes");
  };

  const handleScheduleClick = async () => {
    const result = await swal.fire({
      title: "📅 Your Schedule",
      text: "View your full weekly class schedule and set reminders.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Open Schedule",
      cancelButtonText: "Not now",
    });
    if (result.isConfirmed) navigate("/student/schedule");
  };

  const handleScheduleItemClick = async ({ title, subject, time }) => {
    const result = await swal.fire({
      title: `📖 ${title}`,
      html: `
        <div class="text-left text-sm space-y-1.5">
          <p>🕐 Time: <b>${time}</b></p>
          <p>📚 Subject: <b>${subject}</b></p>
          <p>👨‍🏫 Instructor: <b>Kapil Sharma</b></p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Join Class",
      cancelButtonText: "Set Reminder",
      showDenyButton: true,
      denyButtonText: "Skip",
    });
    if (result.isConfirmed) {
      swal.fire({ title: "✅ Class Joining...", text: "Connecting to live session.", icon: "success", timer: 2000, showConfirmButton: false });
    } else if (result.isDismissed && result.dismiss === Swal.DismissReason.cancel) {
      swal.fire({ title: "⏰ Reminder Set!", text: `We'll remind you before "${title}" starts.`, icon: "success", timer: 2000, showConfirmButton: false });
    }
  };

  const handleStatCardClick = async (label, value) => {
    const routeMap = {
      "Total Enrollments":  { path: "/student/my-courses",     text: "Go to My Courses" },
      "In Progress":        { path: "/student/my-courses",     text: "View In-Progress" },
      "Completed":          { path: "/student/certificates",   text: "View Certificates" },
      "Pending Tasks":      { path: "/student/assignments",    text: "View Assignments" },
      "Quizzes":            { path: "/student/quizzes",        text: "View Quizzes" },
      "Learning Streak":    { path: null,                      text: "Keep it up!" },
    };
    const info = routeMap[label] ?? { path: null, text: "Close" };

    const result = await swal.fire({
      title: label,
      html: `<span class="text-4xl font-bold text-blue-600">${value}</span>`,
      icon: "info",
      showCancelButton: !!info.path,
      confirmButtonText: info.text,
      cancelButtonText: "Close",
    });
    if (result.isConfirmed && info.path) navigate(info.path);
  };

  const handleAssignmentClick = async (assignment) => {
    const isLate = assignment.dueDate && new Date(assignment.dueDate) < new Date();
    const due = fmtDate(assignment.dueDate);
    const result = await swal.fire({
      title: isLate ? "⚠️ Overdue Assignment" : "📋 Assignment Details",
      html: `
        <div class="text-left text-sm space-y-1.5">
          <p><b>${assignment.title}</b></p>
          <p>📚 Course: ${assignment.course?.title ?? "General"}</p>
          ${due ? `<p class="${isLate ? "text-red-600 font-semibold" : ""}">📅 Due: ${due}</p>` : ""}
          ${assignment.instructions ? `<p>📝 ${assignment.instructions}</p>` : ""}
        </div>
      `,
      icon: isLate ? "warning" : "info",
      showCancelButton: true,
      confirmButtonText: "Go to Assignments",
      cancelButtonText: "Close",
    });
    if (result.isConfirmed) navigate("/student/assignments");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-60">
        <span className="w-7 h-7 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Globus Learning! 🎓
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <button
          onClick={handleScheduleClick}
          className="flex items-center gap-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          <FiCalendar size={14} /> Schedule
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
        {[
          { label: "Total Enrollments", value: total,                              icon: <FiBookOpen size={22} />,   bg: "from-blue-500 to-blue-700" },
          { label: "In Progress",        value: total - done,                      icon: <FiPlay size={22} />,       bg: "from-cyan-500 to-cyan-700" },
          { label: "Completed",          value: done,                              icon: <FiAward size={22} />,      bg: "from-emerald-500 to-emerald-700" },
          { label: "Pending Tasks",      value: pending.length,                    icon: <FiCheckSquare size={22} />, bg: "from-amber-500 to-amber-600" },
          { label: "Quizzes",            value: quizzes.filter(q => !q.completed).length, icon: <FiVideo size={22} />, bg: "from-violet-500 to-violet-700" },
          { label: "Learning Streak",    value: "7 days",                          icon: <FiTrendingUp size={22} />, bg: "from-slate-600 to-slate-800" },
        ].map((s) => (
          <StatCard
            key={s.label}
            {...s}
            onClick={() => handleStatCardClick(s.label, s.value)}
          />
        ))}
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT (2/3) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Learning Activity */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Learning Activity</h3>
              <div className="flex gap-1.5">
                {["Today", "Yesterday", "This Week"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      activeTab === tab
                        ? "bg-blue-500 text-white"
                        : "text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <ActivityRow icon={<FiClock />}       label="Active Learning"     value="2 hrs 30 mins" color="text-blue-600" />
              <ActivityRow icon={<FiVideo />}        label="Video Watched"       value="1 hr 15 mins"  color="text-cyan-600" />
              <ActivityRow icon={<FiCheckSquare />}  label="Assignments Done"    value="3 tasks"        color="text-emerald-600" />
              <ActivityRow icon={<FiAward />}        label="Quizzes Attempted"   value="2 quizzes"      color="text-amber-600" />
            </div>
          </Card>

          {/* My Courses */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">My Courses</h3>
              <button
                onClick={handleViewAllCourses}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View all <FiArrowRight size={14} />
              </button>
            </div>
            {total === 0 ? (
              <div className="text-center py-8">
                <FiBookOpen size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-500">Not enrolled in any course yet</p>
                <button
                  onClick={handleExploreCourses}
                  className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
                >
                  Explore Courses
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {courses.slice(0, 5).map((course) => (
                  <CourseRow
                    key={course._id}
                    course={course}
                    onClick={() => handleOpenCourse(course)}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Pending Assignments */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pending Assignments</h3>
              <button
                onClick={handleViewAllAssignments}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                All tasks <FiArrowRight size={14} />
              </button>
            </div>
            {pending.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">All tasks done! Nothing pending. ✅</p>
              </div>
            ) : (
              <div className="space-y-2">
                {pending.slice(0, 5).map((a, idx) => (
                  <AssignmentRow
                    key={a._id ?? idx}
                    assignment={a}
                    onClick={() => handleAssignmentClick(a)}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT (1/3) */}
        <div className="space-y-6">

          {/* Overall Progress */}
          <Card>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Overall Progress</h3>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor"
                    className="text-gray-200 dark:text-gray-700" strokeWidth="6" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor"
                    className="text-blue-500" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${(avgPct / 100) * 339.29} 339.29`}
                    style={{ transition: "stroke-dasharray 0.8s ease" }} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{avgPct}%</span>
                  <span className="text-xs text-gray-500">Complete</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold text-gray-900 dark:text-white">{done}/{total}</span> courses completed
              </p>
              {resume && (
                <button
                  onClick={() => handleResumeCourse(resume)}
                  className="mt-3 flex items-center gap-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg transition"
                >
                  <FiPlay size={12} className="fill-current" /> Resume Last Course
                </button>
              )}
            </div>
          </Card>

          {/* Upcoming Quizzes */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Upcoming Quizzes</h3>
              <button
                onClick={handleViewAllQuizzes}
                className="text-xs font-semibold text-blue-500 flex items-center gap-0.5 hover:underline"
              >
                View all <FiArrowRight size={11} />
              </button>
            </div>
            {quizzes.filter(q => !q.completed).length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No quizzes scheduled</p>
            ) : (
              <div className="space-y-2">
                {quizzes.filter(q => !q.completed).slice(0, 4).map((quiz) => (
                  <div
                    key={quiz._id}
                    className="flex items-start justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{quiz.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{quiz.course?.title ?? "General"}</p>
                    </div>
                    <button
                      onClick={() => handleAttemptQuiz(quiz)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 shrink-0 ml-2 whitespace-nowrap bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-lg hover:bg-blue-100 transition"
                    >
                      Attempt
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Today's Schedule */}
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Today's Schedule</h3>
              <button
                onClick={handleScheduleClick}
                className="text-xs font-semibold text-blue-500 flex items-center gap-0.5 hover:underline"
              >
                Full calendar <FiArrowRight size={11} />
              </button>
            </div>
            <div className="space-y-2">
              {[
                { time: "12:30 PM", title: "Scalar & Vector",     subject: "Physics"   },
                { time: "03:00 PM", title: "Quadratic Equations",  subject: "Maths"     },
                { time: "05:00 PM", title: "Organic Chemistry",    subject: "Chemistry" },
              ].map((cls, i) => (
                <ScheduleItem
                  key={i}
                  {...cls}
                  onClick={() => handleScheduleItemClick(cls)}
                />
              ))}
            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   Micro-components
════════════════════════════════════════ */

const Card = ({ children }) => (
  <div className="bg-white dark:bg-[#1f2337] rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
    {children}
  </div>
);

const StatCard = ({ label, value, icon, bg, onClick }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-br ${bg} rounded-xl p-4 text-white shadow-md hover:shadow-xl hover:scale-105 active:scale-100 transition-all duration-200 text-left w-full`}
  >
    <div className="p-2 bg-white/20 rounded-lg w-fit mb-3">{icon}</div>
    <p className="text-white/70 text-[10px] font-semibold uppercase tracking-wider mb-1">{label}</p>
    <p className="text-3xl font-bold">{value}</p>
  </button>
);

const ActivityRow = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
    <div className="flex items-center gap-3">
      <span className={`${color} text-base`}>{icon}</span>
      <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
    </div>
    <p className="text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
  </div>
);

const CourseRow = ({ course, onClick }) => {
  const p = course.progressPercentage ?? 0;
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group"
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
        {course.thumbnail ? (
          <img
            src={`http://localhost:4000${course.thumbnail}`}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FiBookOpen size={16} />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate group-hover:text-blue-600 transition">
          {course.title}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                p >= 75 ? "bg-emerald-500" : p >= 50 ? "bg-blue-500" : "bg-amber-400"
              }`}
              style={{ width: `${p}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 font-semibold shrink-0">{p}%</span>
        </div>
      </div>
    </button>
  );
};

const AssignmentRow = ({ assignment, onClick }) => {
  const due    = fmtDate(assignment.dueDate);
  const isLate = assignment.dueDate && new Date(assignment.dueDate) < new Date();
  return (
    <button
      onClick={onClick}
      className="w-full text-left flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/10 transition"
    >
      <div className="min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{assignment.title}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {assignment.course?.title ?? "General"}{due && ` • Due ${due}`}
        </p>
      </div>
      <span
        className={`text-xs font-semibold shrink-0 ml-2 px-2 py-1 rounded ${
          isLate
            ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"
        }`}
      >
        {isLate ? "Late" : "Pending"}
      </span>
    </button>
  );
};

const ScheduleItem = ({ time, title, subject, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left flex items-start justify-between p-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group"
  >
    <div>
      <p className="text-xs text-gray-400 font-semibold">{time}</p>
      <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 group-hover:text-blue-600 transition">
        {title}
      </p>
      <p className="text-xs text-gray-400">{subject}</p>
    </div>
    <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
  </button>
);

export default StudentDashboard;
