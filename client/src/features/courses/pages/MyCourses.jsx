import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

import CourseCard from "../components/CourseCard";
import EnrolledCourseCard from "../components/EnrolledCourseCard";
import {
  getMyCourses,
  getStudentCourses,
} from "@/features/courses/services/courseService";

const MyCourses = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "student";

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);

        let res;

        if (role === "trainer") {
          res = await getMyCourses();
          setCourses(res?.data || []);
        } else {
          res = await getStudentCourses();

          const enrolledCourses =
            res?.data?.map((enrollment) => {

              return {
                ...enrollment.course, // real course data
                isEnrolled: true,
                progressPercentage: enrollment.progressPercentage,
                status: "active", 
              };
            }) || [];

          setCourses(enrolledCourses);
        }
      } catch (err) {
        setError("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [role]);

  return (
    <div className="space-y-6">
      {/* ===== Header ===== */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {role === "trainer" ? "My Courses" : "Enrolled Courses"}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {role === "trainer" 
              ? "Manage and create your courses" 
              : "Continue learning from your enrolled courses"}
          </p>
        </div>

        {role === "trainer" && (
          <button
            aria-label="Create New Course"
            onClick={() => navigate("/trainer/courses/create")}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <FiPlus size={18} />
            Create Course
          </button>
        )}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <span className="w-8 h-8 rounded-full border-3 border-blue-500 border-t-transparent animate-spin" />
        </div>
      )}
      
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {role === "trainer"
              ? "You haven't created any courses yet."
              : "You are not enrolled in any courses yet."}
          </p>
          {role === "student" && (
            <button
              onClick={() => navigate("/student/explore-courses")}
              className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              Explore Courses
            </button>
          )}
        </div>
      )}

      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {courses.map((course) =>
            role === "student" ? (
              <EnrolledCourseCard key={course._id} course={course} />
            ) : (
              <CourseCard key={course._id} course={course} role={role} />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
