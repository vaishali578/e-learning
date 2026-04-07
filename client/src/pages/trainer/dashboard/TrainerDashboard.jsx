import {
  FiUsers,
  FiBookOpen,
  FiPlay,
  FiCheckCircle,
  FiAward,
} from "react-icons/fi";
import { getUserName } from "@/utils/getUser";

const TrainerDashboard = () => {
  const user = getUserName();

  // Dummy data for demonstration
  const myCourses = [
    { title: "Physics Masterclass", duration: "45 mins", students: 32 },
    { title: "Advanced Maths", duration: "50 mins", students: 28 },
    { title: "Chemistry Basics", duration: "40 mins", students: 21 },
  ];

  const upcomingClasses = [
    { course: "Physics", topic: "Electric Charges", time: "Today · 12:30 pm", students: 32 },
    { course: "Maths", topic: "Calculus II", time: "Tomorrow · 10:00 am", students: 28 },
    { course: "Chemistry", topic: "Organic Compounds", time: "Tomorrow · 2:00 pm", students: 21 },
  ];

  const tasks = [ 
    { task: "Upload Assignment Solutions", done: false },
    { task: "Review Student Quiz", done: true },
    { task: "Prepare Live Class Slides", done: false },
  ];

  return (
    <div className="space-y-6">

      {/* ===== Greeting ===== */}
      <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
        Good morning, {user}...
      </h1>

      {/* ===== Main Grid ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ================= LEFT SIDE ================= */}
        <div className="lg:col-span-8 space-y-6">

          {/* My Courses */}
          <div className="bg-white dark:bg-[#1f2337] rounded-xl p-5 shadow">
            <h3 className="font-semibold mb-3">My Courses</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myCourses.map((course, i) => (
                <div
                  key={i}
                  className="bg-blue-50 dark:bg-[#252c45] p-4 rounded-xl shadow flex items-center gap-4"
                >
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <FiBookOpen className="text-blue-500" size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {course.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Duration: {course.duration} · {course.students} Students
                    </p>
                    <button aria-label={`Manage course: ${course.title}`} className="mt-2 text-sm bg-blue-500 text-white px-3 py-1.5 rounded-md">
                      Manage Course
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white dark:bg-[#1f2337] rounded-xl p-5 shadow">
            <h3 className="font-semibold mb-3">Upcoming Classes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {upcomingClasses.map((cls, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#252c45] rounded-xl p-4 shadow space-y-2"
                >
                  <p className="text-xs text-blue-500">
                    {cls.course} · {cls.students} Students
                  </p>
                  <h4 className="font-semibold text-sm">{cls.topic}</h4>
                  <p className="text-xs text-gray-500">{cls.time}</p>
                  <button aria-label="Remind me about this class" className="text-xs text-red-500">⏰ Remind me</button>
                </div>
              ))}
            </div>
          </div>

          {/* Today’s Tasks */}
          <div className="bg-white dark:bg-[#1f2337] rounded-xl p-5 shadow">
            <h3 className="font-semibold mb-3">Today’s Tasks</h3>
            <ul className="space-y-2 text-sm">
              {tasks.map((t, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-2 ${
                    t.done ? "text-gray-400" : "text-gray-900 dark:text-white"
                  }`}
                >
                  <FiCheckCircle
                    className={t.done ? "text-green-500" : "text-gray-300"}
                  />
                  {t.task}
                </li>
              ))}
            </ul>
          </div>

          {/* Analytics Overview */}
          <div className="bg-white dark:bg-[#1f2337] rounded-xl p-5 shadow">
            <h3 className="font-semibold mb-3">Analytics Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="bg-green-50 dark:bg-green-900 p-3 rounded-xl text-center">
                <p className="text-green-700 font-semibold">Courses</p>
                <p className="text-xl font-bold">{myCourses.length}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded-xl text-center">
                <p className="text-blue-700 font-semibold">Total Students</p>
                <p className="text-xl font-bold">
                  {myCourses.reduce((acc, cur) => acc + cur.students, 0)}
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded-xl text-center">
                <p className="text-purple-700 font-semibold">Upcoming Classes</p>
                <p className="text-xl font-bold">{upcomingClasses.length}</p>
              </div>
            </div>
          </div>

          {/* Latest Feedbacks */}
          <div className="bg-white dark:bg-[#1f2337] rounded-xl p-5 shadow">
            <h3 className="font-semibold mb-3">Latest Student Feedback</h3>
            <div className="space-y-3">
              <div className="bg-gray-100 dark:bg-[#252c45] p-3 rounded-xl">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  John Doe
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Great session on Physics! Learned a lot.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-[#252c45] p-3 rounded-xl">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Priya Sharma
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  The Maths class was very engaging.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="lg:col-span-4 space-y-4">

          {/* Trainer Performance Card */}
          <div className="bg-blue-100 p-4 rounded-xl">
            <h3 className="font-semibold text-blue-700">
              Excellent Work, {user}!
            </h3>
            <p className="text-xs mt-2">
              You have conducted more classes than 50% of trainers.
            </p>
            <button aria-label="View Reports" className="mt-3 bg-orange-500 text-white px-3 py-1.5 rounded-md text-xs">
              View Reports
            </button>
          </div>

          {/* Milestones */}
          <div className="bg-white dark:bg-[#1f2337] rounded-xl p-5 shadow">
            <h3 className="font-semibold mb-3">Milestones</h3>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <TrainerMilestone label="5 Classes Completed" done />
              <TrainerMilestone label="10 Students Enrolled" active />
              <TrainerMilestone label="Certified Trainer" locked />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-[#1f2337] rounded-xl p-4 shadow space-y-2">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <button aria-label="Start Live Class" className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 justify-center">
              <FiPlay /> Start Live Class
            </button>
            <button aria-label="Review Students" className="w-full bg-green-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 justify-center">
              <FiUsers /> Review Students
            </button>
            <button aria-label="Issue Certificate" className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 justify-center">
              <FiAward /> Issue Certificate
            </button>
          </div>

          {/* Weekly Goal */}
          <div className="bg-white dark:bg-[#1f2337] rounded-xl p-4 shadow">
            <h3 className="font-semibold mb-2">Weekly Goal</h3>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-500 rounded-full w-[70%]" />
            </div>
            <p className="text-xs text-gray-500 mt-1">7 of 10 classes completed</p>
          </div>

          {/* Learning Tips */}
          <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-xl">
            <h3 className="font-semibold text-purple-700">Trainer Tips</h3>
            <p className="text-xs mt-2">
              Share assignments regularly to keep students engaged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;

/* ===== Trainer Milestone Component ===== */
const TrainerMilestone = ({ label, done, active, locked }) => (
  <div className="flex flex-col items-center gap-1">
    <div
      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs
        ${done && "bg-green-500 text-white"}
        ${active && "bg-gray-300"}
        ${locked && "bg-gray-100 text-gray-400"}
      `}
    >
      {done ? "✓" : active ? "⭐" : "🔒"}
    </div>
    <span className="text-xs">{label}</span>
  </div>
);
