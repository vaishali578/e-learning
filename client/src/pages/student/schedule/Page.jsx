
import { useState, useEffect } from "react";
import { FiFilter, FiPlus } from "react-icons/fi";
import ScheduleCard from "@/features/schedule/components/ScheduleCard";
import { getStudentSchedules } from "@/features/schedule/services/scheduleService";

const SchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, upcoming, completed

  useEffect(() => {
    fetchSchedules();
  }, [filter]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await getStudentSchedules({
        upcoming: filter === "upcoming",
        status: filter === "completed" ? "completed" : undefined,
      });
      setSchedules(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError(err || "Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  const upcomingCount = schedules.filter(s => new Date(s.startDate) > new Date()).length;
  const completedCount = schedules.filter(s => s.status === "completed").length;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Schedule
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your learning sessions and classes
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All Schedules
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "upcoming"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Upcoming ({upcomingCount})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === "completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Content Container */}
      <div>
        {/* Loading State */}
        {loading && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-8 h-8 border-3 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full animate-spin" />
            <p className="mt-3 text-gray-500 dark:text-gray-400">Loading schedules...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="py-8 px-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && schedules.length === 0 && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <FiFilter size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              No schedules found
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filter === "upcoming" 
                ? "You have no upcoming schedules" 
                : filter === "completed"
                ? "You have no completed schedules"
                : "No schedules available at the moment"}
            </p>
          </div>
        )}

        {!loading && !error && schedules.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((schedule) => (
              <ScheduleCard key={schedule._id} schedule={schedule} />
            ))}
          </div>
        )}

        {/* Summary */}
        {!loading && !error && schedules.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total: {schedules.length} schedules • Upcoming: {upcomingCount} • Completed: {completedCount}
            </p>
          </div>
        )}
      </div>
    </div>
  );


export default SchedulePage;
