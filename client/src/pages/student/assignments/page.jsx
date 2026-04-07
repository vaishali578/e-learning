import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import AssignmentTabs from "../../../features/assignments/components/AssignmentTabs";
import AssignmentColumn from "../../../features/assignments/components/AssignmentColumn";
import { getStudentAssignments } from "../../../features/courses/services/assignmentService";

const Page = () => {
  const [activeTab, setActiveTab] = useState("To Do");
  const [assignments, setAssignments] = useState({
    "To Do": [],
    "In Progress": [],
    Submit: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await getStudentAssignments();

      // Categorize assignments by status
      const categorized = {
        "To Do": [],
        "In Progress": [],
        Submit: [],
      };

      data.forEach((assignment) => {
        const formattedAssignment = {
          id: assignment._id,
          title: assignment.title,
          description: assignment.instructions,
          date: assignment.createdAt
            ? new Date(assignment.createdAt).toLocaleDateString("en-GB")
            : "N/A",
          marks: assignment.maxMarks,
          progress: assignment.marksObtained
            ? Math.round((assignment.marksObtained / assignment.maxMarks) * 100)
            : 0,
          submissionType: assignment.submissionType,
          courseName: assignment.course?.title || "Unknown Course",
          sectionName: assignment.section?.title || "Unknown Section",
          dueDate: assignment.dueDate
            ? new Date(assignment.dueDate).toLocaleDateString("en-GB")
            : null,
          students: [1, 2, 3], // placeholder
          extraStudents: 0,
          completed: assignment.status === "submitted",
          submitted: assignment.submitted,
        };

        // Determine badge type
        if (assignment.status === "submitted") {
          formattedAssignment.badge = {
            type: "submitted",
            text: `Submitted ${new Date(assignment.submittedAt).toLocaleDateString("en-GB")}`,
          };
          categorized["Submit"].push(formattedAssignment);
        } else if (assignment.status === "pending") {
          formattedAssignment.badge = {
            type: "deadline",
            text: assignment.dueDate
              ? `Deadline ${new Date(assignment.dueDate).toLocaleDateString("en-GB")}`
              : "No deadline",
          };
          categorized["In Progress"].push(formattedAssignment);
        } else {
          formattedAssignment.badge = {
            type: "deadline",
            text: assignment.dueDate
              ? `Deadline ${new Date(assignment.dueDate).toLocaleDateString("en-GB")}`
              : "No deadline",
          };
          categorized["To Do"].push(formattedAssignment);
        }
      });

      setAssignments(categorized);
      setTotalCount(data.length);
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError(err.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Assignment</h1>
          <span className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Assignment</h1>
        </div>
        <div className="text-red-600 bg-red-50 p-4 rounded">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track and manage your assignments</p>
      </div>

      {/* Search and Total Count */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1f2337] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
            />
          </div>
        </div>
        <span className="text-sm font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400 px-4 py-2 rounded-lg whitespace-nowrap">
          Total: {totalCount}
        </span>
      </div>

      {/* Tabs */}
      <AssignmentTabs active={activeTab} setActive={setActiveTab} />

      {/* Cards */}
      <AssignmentColumn assignments={assignments[activeTab]} />
    </div>
  );
};

export default Page;
