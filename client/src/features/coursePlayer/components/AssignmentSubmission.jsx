import { useState } from "react";
import { useParams } from "react-router-dom";
import { markItemComplete } from "../../progress/services/progressService";

export default function AssignmentSubmission({ assignment, onProgressUpdate }) {
  const [answer, setAnswer] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { courseId } = useParams();

  const handleSubmit = async () => {
    if (!answer) {
      alert("Please provide an answer");
      return;
    }

    setSubmitting(true);

    try {
      // 🔥 Mark assignment as completed in course progress
      await markItemComplete({
        courseId,
        itemId: assignment._id,
        itemType: "assignment",
      });

      setSubmitted(true);
      alert("Assignment submitted successfully!");
      setAnswer(null);

      // Notify parent to refresh progress
      if (onProgressUpdate) {
        onProgressUpdate();
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
        Submit Assignment
      </h3>

      {assignment.submissionType === "text" && (
        <textarea
          className="w-full border border-gray-300 dark:border-gray-600 rounded p-3 bg-white dark:bg-[#1a1d2e] text-gray-900 dark:text-white"
          rows={6}
          placeholder="Write your answer here..."
          onChange={(e) => setAnswer(e.target.value)}
        />
      )}

      {assignment.submissionType === "file" && (
        <input
          type="file"
          className="w-full text-gray-900 dark:text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-4 file:py-2"
          onChange={(e) => setAnswer(e.target.files?.[0] || null)}
        />
      )}

      {assignment.submissionType === "link" && (
        <input
          type="url"
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-[#1a1d2e] text-gray-900 dark:text-white"
          placeholder="Paste submission link"
          onChange={(e) => setAnswer(e.target.value)}
        />
      )}

      <button
      aria-label="Submit Assignment"
        onClick={handleSubmit}
        disabled={submitting || submitted}
        className="mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-5 py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitted ? "✓ Submitted" : submitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}