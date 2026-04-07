import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import CourseCard from "../components/CourseCard";
import { getAllCourses } from "../services/courseService";

export default function AllCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await getAllCourses();
        if (!isMounted) return;
        setCourses(res.data || []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.response?.data?.message || "Failed to load courses");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <span className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mx-auto block mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg max-w-md">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">Error</p>
          <p className="text-sm text-red-500 dark:text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Explore Courses
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Discover and enroll in courses to boost your skills
        </p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1f2337] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition"
          />
        </div>
      </div>

      {/* Results Info */}
      {filteredCourses.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold">{filteredCourses.length}</span> course{filteredCourses.length !== 1 ? "s" : ""}
        </div>
      )}

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            {searchQuery ? "No courses match your search" : "No courses available"}
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-2"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
