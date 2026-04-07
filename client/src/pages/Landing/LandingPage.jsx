import {
  FiPlay,
  FiArrowRight,
  FiUsers,
  FiVideo,
  FiBookOpen,
  FiCheckCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* ================= TOP NAV ================= */}
      <header className="border-b dark:border-[#1E2B4A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            Globus-E-Learning
          </h1>

          <div className="flex items-center gap-3">
            <Link
              to="/auth/login"
              className="text-sm px-4 py-2 rounded-lg border dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkHover"
            >
              Login
            </Link>
            <Link
              to="/auth/signup"
              className="text-sm px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ================= PAGE CONTENT ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-32">
        {/* ================= HERO ================= */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              Learn Smarter with{" "}
              <span className="text-blue-600 dark:text-blue-400">
                Live Classes & Real Progress
              </span>
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-xl">
              Attend expert-led live classes, track your learning progress, and
              master skills with structured courses built for real results.
            </p>

            <div className="flex items-center gap-4">
              <button aria-label="Get Started" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium">
                Get Started <FiArrowRight />
              </button>

              <button aria-label="Watch Demo" className="flex items-center gap-2 border dark:border-gray-700 px-6 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-darkHover">
                <FiPlay /> Watch Demo
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#101D35] border dark:border-[#1E2B4A] rounded-3xl p-6 shadow">
            <img
              src="/assets/images/landing/hero-dashboard.webp"
              alt="dashboard"
              className="rounded-2xl"
            />
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <FiUsers />, label: "Active Students", value: "25K+" },
            { icon: <FiVideo />, label: "Live Classes", value: "1,200+" },
            { icon: <FiBookOpen />, label: "Courses", value: "150+" },
            { icon: <FiCheckCircle />, label: "Success Rate", value: "92%" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#101D35] border dark:border-[#1E2B4A] rounded-2xl p-6 flex items-center gap-4"
            >
              <div className="p-3 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl text-xl">
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {item.value}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {item.label}
                </p>
              </div>
            </div>
          ))}
        </section>

        {/* ================= FEATURES ================= */}
        <section className="text-center space-y-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Why Students Love Our Platform
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Everything you need to learn, track, and grow — in one place.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              "Live Interactive Classes",
              "Progress Tracking",
              "Structured Courses",
              "Assignments & Tests",
              "Anytime Access",
              "Certified Learning",
            ].map((title, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#101D35] border dark:border-[#1E2B4A] rounded-2xl p-6 text-left"
              >
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Professional curriculum designed for real learning outcomes.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section className="bg-blue-600 dark:bg-blue-500 rounded-3xl px-6 py-14 text-center text-white space-y-4">
          <h2 className="text-3xl font-bold">
            Start Your Learning Journey Today
          </h2>
          <p className="opacity-90">
            Join thousands of students learning smarter every day.
          </p>
          <button aria-label="Enroll Now" className="bg-white text-blue-600 font-medium px-6 py-3 rounded-xl hover:bg-gray-100">
            Enroll Now
          </button>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
