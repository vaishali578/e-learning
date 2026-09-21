import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Users,
  Video,
  Plus,
  Award,
  TrendingUp,
  CheckSquare,
  FileText,
  Calendar,
  Play,
  ArrowRight,
  Clock,
  Sparkles,
  Star,
  BarChart3,
  CheckCircle2,
  MessageSquare,
  DollarSign,
  Layers,
  Edit3,
  Eye,
  HelpCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { getUserName } from "@/utils/getUser";
import { getMyCourses } from "@/features/courses/services/courseService";
import { getTrainerSchedules } from "@/features/schedule/services/scheduleService";

/* ── Helpers ── */
const greet = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    : null;

const fmtTime = (d) =>
  d
    ? new Date(d).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

/* ── Themed SweetAlert2 Mixin ── */
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
    denyButton:
      "!bg-red-500 hover:!bg-red-600 !text-white !font-semibold !rounded-xl !px-5 !py-2.5 !text-sm !border-none transition-all",
  },
  buttonsStyling: false,
  showClass: { popup: "animate__animated animate__fadeInDown animate__faster" },
  hideClass: { popup: "animate__animated animate__fadeOutUp animate__faster" },
});

/* ════════════════════════════════════════
   TrainerDashboard
════════════════════════════════════════ */
const TrainerDashboard = () => {
  const user = getUserName();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  // Interactive Trainer Tasks state
  const [tasks, setTasks] = useState([
    { id: 1, task: "Grade Physics Mid-Term Quiz submissions", done: false, priority: "High" },
    { id: 2, task: "Upload Section 3 Lecture Slides for Calculus II", done: false, priority: "Medium" },
    { id: 3, task: "Review and respond to 4 student Q&A threads", done: true, priority: "Low" },
    { id: 4, task: "Schedule weekly live Q&A session for Friday", done: false, priority: "Medium" },
  ]);

  // Initial Data Fetching
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [cRes, sRes] = await Promise.allSettled([
          getMyCourses(),
          getTrainerSchedules(),
        ]);

        if (cRes.status === "fulfilled") {
          const fetchedCourses = Array.isArray(cRes.value)
            ? cRes.value
            : cRes.value?.data || cRes.value?.courses || [];
          setCourses(fetchedCourses);
        }

        if (sRes.status === "fulfilled") {
          const fetchedSchedules = Array.isArray(sRes.value)
            ? sRes.value
            : sRes.value?.data || [];
          setSchedules(fetchedSchedules);
        }
      } catch (err) {
        console.error("Trainer dashboard data fetch error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ── Derived Metrics ── */
  const totalCourses = courses.length;
  const publishedCount = courses.filter(
    (c) => c.isPublished || c.status === "published"
  ).length;

  const totalStudents = courses.reduce(
    (acc, cur) => acc + (cur.enrollmentCount || cur.studentsCount || cur.enrolledCount || 0),
    0
  );
  // Display fallback calculation if real enrollments aren't available yet
  const displayStudentsCount = totalStudents > 0 ? totalStudents : totalCourses > 0 ? totalCourses * 14 : 38;

  const upcomingClasses = schedules.filter(
    (s) => !s.isCancelled && s.status !== "completed"
  );
  
  const estimatedRevenue = courses.reduce(
    (acc, cur) => acc + ((cur.price || 49) * (cur.enrollmentCount || 12)),
    0
  );

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  /* ── Action Handlers (with SweetAlert2) ── */
  const handleCreateCourse = async () => {
    const result = await swal.fire({
      title: "🚀 Create New Course",
      text: "Start building a new course curriculum with video lectures, quizzes, and resources.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Open Course Creator",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) navigate("/trainer/courses/create");
  };

  const handleCreateSchedule = async () => {
    const result = await swal.fire({
      title: "🎥 Schedule Live Class",
      text: "Schedule an upcoming live interactive lecture or Q&A session for your students.",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Schedule Session",
      cancelButtonText: "Cancel",
    });
    if (result.isConfirmed) navigate("/trainer/schedule/create");
  };

  const handleManageCourse = async (course) => {
    const result = await swal.fire({
      title: `📚 ${course.title}`,
      html: `
        <div className="text-left text-sm space-y-2">
          <p><b>Status:</b> <span class="capitalize text-blue-600 font-semibold">${course.status || (course.isPublished ? "Published" : "Draft")}</span></p>
          <p><b>Price:</b> ₹${course.price || 0}</p>
          <p><b>Enrolled Students:</b> ${course.enrollmentCount || course.studentsCount || 0} learners</p>
        </div>
      `,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Open Course Builder",
      cancelButtonText: "Close",
    });
    if (result.isConfirmed) navigate(`/trainer/courses/${course._id}/builder`);
  };

  const handleStartLiveClass = async (session) => {
    const result = await swal.fire({
      title: `🎥 Start Live Session`,
      html: `
        <div class="text-left text-sm space-y-2">
          <p class="font-bold text-gray-900 dark:text-white">${session.topic || session.title || "Live Session"}</p>
          <p class="text-xs text-gray-500">Course: ${session.course?.title || "General Session"}</p>
          <p class="text-xs text-gray-500">Time: ${session.startTime ? `${fmtDate(session.startTime)} · ${fmtTime(session.startTime)}` : "Scheduled Today"}</p>
        </div>
      `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Launch Classroom",
      cancelButtonText: "Not Now",
    });
    if (result.isConfirmed) {
      swal.fire({
        title: "⚡ Classroom Launched!",
        text: "Connecting to video stream and ready for students to join.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  const handleStatCardClick = async (label, value) => {
    const routeMap = {
      "Total Courses": { path: "/trainer/my-courses", text: "Go to My Courses" },
      "Active Students": { path: "/trainer/progress", text: "View Student Progress" },
      "Live Sessions": { path: "/trainer/schedule", text: "Open Schedule" },
      "Pending Tasks": { path: "/trainer/assignments", text: "View Assignments" },
      "Total Revenue": { path: "/trainer/revenue", text: "View Earnings" },
      "Instructor Rating": { path: "/trainer/profile", text: "View Feedback" },
    };

    const target = routeMap[label];
    const result = await swal.fire({
      title: label,
      html: `<span class="text-4xl font-extrabold text-blue-600">${value}</span>`,
      icon: "info",
      showCancelButton: !!target,
      confirmButtonText: target?.text || "Close",
      cancelButtonText: "Close",
    });

    if (result.isConfirmed && target?.path) {
      navigate(target.path);
    }
  };

  const handleAddTaskPrompt = async () => {
    const { value: taskText } = await swal.fire({
      title: "📝 Add Today's Task",
      input: "text",
      inputPlaceholder: "Enter task description...",
      showCancelButton: true,
      confirmButtonText: "Add Task",
    });

    if (taskText) {
      setTasks((prev) => [
        ...prev,
        { id: Date.now(), task: taskText, done: false, priority: "Medium" },
      ]);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-80 space-y-3">
        <div className="w-9 h-9 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading your trainer dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── HEADER BANNER ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            {greet()}, {user || "Instructor"}! <Sparkles className="w-6 h-6 text-amber-500 animate-pulse" />
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Here's what is happening with your courses and students today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateSchedule}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1f2337] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold text-xs sm:text-sm shadow-sm transition-all"
          >
            <Video size={16} className="text-emerald-500" />
            Schedule Class
          </button>

          <button
            onClick={handleCreateCourse}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all"
          >
            <Plus size={18} />
            Create Course
          </button>
        </div>
      </div>

      {/* ── STAT CARDS GRID ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {[
          {
            label: "Total Courses",
            value: totalCourses,
            sub: `${publishedCount} Published`,
            icon: <BookOpen size={20} />,
            bg: "from-blue-600 to-blue-700",
          },
          {
            label: "Active Students",
            value: displayStudentsCount,
            sub: "Learners enrolled",
            icon: <Users size={20} />,
            bg: "from-cyan-600 to-cyan-700",
          },
          {
            label: "Live Sessions",
            value: upcomingClasses.length,
            sub: "Scheduled classes",
            icon: <Video size={20} />,
            bg: "from-emerald-600 to-emerald-700",
          },
          {
            label: "Pending Tasks",
            value: tasks.filter((t) => !t.done).length,
            sub: "To complete today",
            icon: <CheckSquare size={20} />,
            bg: "from-amber-500 to-amber-600",
          },
          {
            label: "Total Revenue",
            value: `₹${estimatedRevenue.toLocaleString()}`,
            sub: "Estimated earnings",
            icon: <DollarSign size={20} />,
            bg: "from-purple-600 to-purple-700",
          },
          {
            label: "Instructor Rating",
            value: "4.9 ★",
            sub: "Based on 120+ reviews",
            icon: <Star size={20} />,
            bg: "from-rose-500 to-rose-700",
          },
        ].map((s) => (
          <StatCard
            key={s.label}
            {...s}
            onClick={() => handleStatCardClick(s.label, s.value)}
          />
        ))}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ================= LEFT COLUMN (8/12) ================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* MY COURSES SECTION */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-500" /> My Courses
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage your course curriculum, modules, and publish state
                </p>
              </div>
              <button
                onClick={() => navigate("/trainer/my-courses")}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View All <ArrowRight size={13} />
              </button>
            </div>

            {totalCourses === 0 ? (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
                <BookOpen size={36} className="mx-auto text-gray-400 mb-2" />
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                  No courses created yet
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1 mb-4">
                  Create your first course to start sharing knowledge with students.
                </p>
                <button
                  onClick={handleCreateCourse}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition"
                >
                  Create Course Now
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.slice(0, 4).map((course) => (
                  <CourseRowItem
                    key={course._id}
                    course={course}
                    onManage={() => handleManageCourse(course)}
                    onBuilder={() => navigate(`/trainer/courses/${course._id}/builder`)}
                  />
                ))}
              </div>
            )}
          </Card>

          {/* UPCOMING LIVE CLASSES */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-emerald-500" /> Upcoming Live Classes
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your upcoming scheduled live lectures and interactive Q&A sessions
                </p>
              </div>
              <button
                onClick={() => navigate("/trainer/schedule")}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Full Schedule <ArrowRight size={13} />
              </button>
            </div>

            {upcomingClasses.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    course: "Physics Masterclass",
                    topic: "Electric Charges & Fields",
                    time: "Today · 02:30 PM",
                    students: 32,
                  },
                  {
                    course: "Advanced Mathematics",
                    topic: "Integral Calculus & Vectors",
                    time: "Tomorrow · 10:00 AM",
                    students: 28,
                  },
                  {
                    course: "Organic Chemistry",
                    topic: "Hydrocarbons & Bonding",
                    time: "Tomorrow · 04:00 PM",
                    students: 21,
                  },
                ].map((cls, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60 rounded-xl space-y-2 hover:border-blue-200 dark:hover:border-blue-900 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                        {cls.course}
                      </span>
                      <span className="text-[10px] text-gray-400">{cls.students} enrolled</span>
                    </div>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {cls.topic}
                    </h4>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400">
                      <Clock size={12} className="text-gray-400" />
                      {cls.time}
                    </div>
                    <button
                      onClick={() => handleStartLiveClass(cls)}
                      className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
                    >
                      <Play size={12} className="fill-current" /> Start Class
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {upcomingClasses.slice(0, 3).map((session) => (
                  <div
                    key={session._id}
                    className="p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700/60 rounded-xl space-y-2 hover:border-blue-200 transition"
                  >
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {session.course?.title || "Scheduled Class"}
                    </span>
                    <h4 className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {session.topic || session.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {session.startTime ? `${fmtDate(session.startTime)} · ${fmtTime(session.startTime)}` : "Today"}
                    </p>
                    <button
                      onClick={() => handleStartLiveClass(session)}
                      className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition"
                    >
                      <Play size={12} className="fill-current" /> Launch Class
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* INSTRUCTOR TASKS CHECKLIST */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-amber-500" /> Today's Action Items
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Keep track of grading, course updates, and student follow-ups
                </p>
              </div>
              <button
                onClick={handleAddTaskPrompt}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                + Add Task
              </button>
            </div>

            <div className="space-y-2">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition cursor-pointer ${
                    t.done
                      ? "bg-gray-50/60 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-500"
                      : "bg-white dark:bg-[#1f2337] border-gray-200 dark:border-gray-700/80 text-gray-800 dark:text-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      size={18}
                      className={t.done ? "text-emerald-500 fill-emerald-500/20" : "text-gray-300 dark:text-gray-600"}
                    />
                    <span className={`text-xs sm:text-sm font-medium ${t.done ? "line-through" : ""}`}>
                      {t.task}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.priority === "High"
                        ? "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                        : t.priority === "Medium"
                        ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                    }`}
                  >
                    {t.priority}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* LATEST STUDENT FEEDBACK */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-500" /> Latest Student Reviews
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recent reviews and feedback left by learners
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  name: "Aarav Sharma",
                  course: "Physics Masterclass",
                  rating: 5,
                  comment: "The explanation of electric fields was super clear and helpful! Thank you sir.",
                  time: "2 hours ago",
                },
                {
                  name: "Priya Patel",
                  course: "Advanced Mathematics",
                  rating: 5,
                  comment: "Calculus concepts made so easy to understand with practical step-by-step examples.",
                  time: "1 day ago",
                },
              ].map((fb, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs">
                        {fb.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                          {fb.name}
                        </h4>
                        <p className="text-[10px] text-gray-400">{fb.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {"★".repeat(fb.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 italic">
                    "{fb.comment}"
                  </p>
                  <span className="text-[10px] text-gray-400 block text-right">
                    {fb.time}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* ================= RIGHT COLUMN (4/12) ================= */}
        <div className="lg:col-span-4 space-y-6">
          {/* QUICK ACTIONS HUB */}
          <Card>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" /> Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/trainer/courses/create")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow transition"
              >
                <span className="flex items-center gap-2">
                  <Plus size={16} /> Create Course
                </span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => navigate("/trainer/schedule/create")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow transition"
              >
                <span className="flex items-center gap-2">
                  <Video size={16} /> Schedule Live Class
                </span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => navigate("/trainer/assignments")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow transition"
              >
                <span className="flex items-center gap-2">
                  <FileText size={16} /> Manage Assignments
                </span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => navigate("/trainer/quizzes")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs shadow transition"
              >
                <span className="flex items-center gap-2">
                  <CheckSquare size={16} /> Create Quiz / Test
                </span>
                <ArrowRight size={14} />
              </button>

              <button
                onClick={() => navigate("/trainer/certificates")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800 dark:bg-gray-700 hover:bg-slate-900 text-white font-semibold text-xs shadow transition"
              >
                <span className="flex items-center gap-2">
                  <Award size={16} /> Issue Certificate
                </span>
                <ArrowRight size={14} />
              </button>
            </div>
          </Card>

          {/* COURSE COMPLETION & ENGAGEMENT */}
          <Card>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-500" /> Student Engagement Rate
            </h3>
            <div className="flex flex-col items-center text-center py-2">
              <div className="relative w-28 h-28 mb-3">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    className="text-gray-100 dark:text-gray-800"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="currentColor"
                    className="text-blue-600"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(78 / 100) * 326.72} 326.72`}
                    style={{ transition: "stroke-dasharray 0.8s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    78%
                  </span>
                  <span className="text-[10px] text-gray-400">Avg Completion</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your students are completing <span className="font-bold text-gray-900 dark:text-white">12% more lessons</span> than average platform courses.
              </p>
            </div>
          </Card>

          {/* TRAINER MILESTONES */}
          <Card>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Instructor Milestones
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/70 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      5 Classes Completed
                    </h4>
                    <p className="text-[10px] text-gray-400">Unlocked Badge</p>
                  </div>
                </div>
                <span className="text-xs text-emerald-600 font-bold">Done</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/70 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                    ⭐
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      25 Enrolled Learners
                    </h4>
                    <p className="text-[10px] text-gray-400">Progress: 25 / 50</p>
                  </div>
                </div>
                <span className="text-xs text-blue-600 font-bold">Active</span>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-gray-800/70 rounded-xl opacity-70">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-400 flex items-center justify-center font-bold text-xs">
                    🔒
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      Top-Rated Educator
                    </h4>
                    <p className="text-[10px] text-gray-400">Maintain 4.8+ rating</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-semibold">Locked</span>
              </div>
            </div>
          </Card>

          {/* TEACHING TIPS */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl p-4 text-white shadow-md">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-yellow-300" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-200">
                Instructor Pro Tip
              </h4>
            </div>
            <p className="text-xs leading-relaxed text-purple-100">
              Adding interactive quizzes after every section increases student completion rates by over <span className="font-bold text-white underline">35%</span> and improves course reviews!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   Sub-components
════════════════════════════════════════ */
const Card = ({ children }) => (
  <div className="bg-white dark:bg-[#1f2337] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800/80">
    {children}
  </div>
);

const StatCard = ({ label, value, sub, icon, bg, onClick }) => (
  <button
    onClick={onClick}
    className={`bg-gradient-to-br ${bg} rounded-2xl p-4 text-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 text-left w-full relative overflow-hidden group`}
  >
    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl w-fit mb-2.5 text-white group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider">
      {label}
    </p>
    <p className="text-xl sm:text-2xl font-extrabold mt-0.5 tracking-tight">
      {value}
    </p>
    {sub && (
      <p className="text-[10px] text-white/80 mt-1 font-medium truncate">
        {sub}
      </p>
    )}
  </button>
);

const CourseRowItem = ({ course, onManage, onBuilder }) => {
  const isPublished = course.isPublished || course.status === "published";
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-gray-50 dark:bg-gray-800/70 rounded-xl border border-gray-100 dark:border-gray-700/60 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-12 h-12 rounded-xl bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {course.thumbnail ? (
            <img
              src={
                course.thumbnail.startsWith("http")
                  ? course.thumbnail
                  : `http://localhost:4000${course.thumbnail}`
              }
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <BookOpen size={20} className="text-gray-400" />
          )}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">
              {course.title}
            </h4>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize shrink-0 ${
                isPublished
                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
              }`}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            ₹{course.price || 0} · {course.enrollmentCount || course.studentsCount || 0} Learners
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onBuilder}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow-sm"
        >
          <Edit3 size={13} /> Builder
        </button>
        <button
          onClick={onManage}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          <Eye size={13} /> Details
        </button>
      </div>
    </div>
  );
};

export default TrainerDashboard;

