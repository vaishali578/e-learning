import { useState, useEffect } from "react";
import { FiPlus, FiFilter } from "react-icons/fi";
import ScheduleCard from "@/features/schedule/components/ScheduleCard";
import CreateScheduleModal from "@/features/schedule/components/CreateScheduleModal";
import { getTrainerSchedules } from "@/features/schedule/services/scheduleService";

const TrainerSchedulePage = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, scheduled, completed, cancelled
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSchedules();
  }, [filter]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const data = await getTrainerSchedules({
        status: filter === "all" ? undefined : filter,
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

  const scheduledCount = schedules.filter(s => s.status === "scheduled").length;
  const completedCount = schedules.filter(s => s.status === "completed").length;
  const cancelledCount = schedules.filter(s => s.isCancelled).length;

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Schedules
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Create and manage your learning sessions
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:shadow-lg transition-all font-medium text-sm"
        >
          <FiPlus size={18} />
          Create Schedule
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === "all"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          All Schedules ({schedules.length})
        </button>
        <button
          onClick={() => setFilter("scheduled")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === "scheduled"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Scheduled ({scheduledCount})
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === "completed"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Completed ({completedCount})
        </button>
        <button
          onClick={() => setFilter("cancelled")}
          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            filter === "cancelled"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          Cancelled ({cancelledCount})
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {filter === "scheduled" 
                ? "You have no scheduled sessions" 
                : filter === "completed"
                ? "You have no completed sessions"
                : filter === "cancelled"
                ? "You have no cancelled sessions"
                : "Create your first schedule to get started"}
            </p>
            {filter === "all" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:shadow-lg transition-all font-medium text-sm"
              >
                <FiPlus size={16} />
                Create Schedule
              </button>
            )}
          </div>
        )}

        {/* Schedule Grid */}
        {!loading && !error && schedules.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {schedules.map((schedule) => (
              <ScheduleCard key={schedule._id} schedule={schedule} isTrainer={true} />
            ))}
          </div>
        )}

        {/* Summary */}
        {!loading && !error && schedules.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Total: {schedules.length} schedules • Scheduled: {scheduledCount} • Completed: {completedCount} • Cancelled: {cancelledCount}
            </p>
          </div>
        )}
      </div>

      {/* Create Schedule Modal */}
      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchSchedules()}
      />
    </div>
  );
};

export default TrainerSchedulePage;
