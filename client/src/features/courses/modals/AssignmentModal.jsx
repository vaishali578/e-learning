import { X } from "lucide-react";
import { useState } from "react";
import { createAssignment } from "../services/assignmentService";

export default function AssignmentModal({ onClose, courseId, sectionId }) {
  const [form, setForm] = useState({
    title: "",
    instructions: "",
    dueDate: "",
    maxMarks: "",
    submissionType: "file", // default type
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // for error messages

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError(null);

    if (!form.title.trim()) {
      setError("Assignment title is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        instructions: form.instructions.trim(),
        dueDate: form.dueDate,
        maxMarks: form.maxMarks,
        submissionType: form.submissionType,
        courseId,
        sectionId,
      };

      const res = await createAssignment(payload);

      onClose(); // close modal after success
    } catch (err) {
      console.error("Failed to create assignment:", err);
      setError("Failed to create assignment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#1f2337] rounded-xl w-full max-w-lg p-6 space-y-4">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Add Assignment</h2>
          <button
          aria-label="Close Assignment Modal"
            onClick={onClose}
            disabled={loading}
            className="cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
            {error}
          </div>
        )}

        {/* Title */}
        <input
          name="title"
          placeholder="Assignment title"
          value={form.title}
          onChange={handleChange}
          className="w-full border rounded-md p-2 text-sm"
          disabled={loading}
        />

        {/* Instructions */}
        <textarea
          name="instructions"
          placeholder="Assignment instructions"
          rows={4}
          value={form.instructions}
          onChange={handleChange}
          className="w-full border rounded-md p-2 text-sm"
          disabled={loading}
        />

        {/* Due date & max marks */}
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            className="border rounded-md p-2 text-sm"
            disabled={loading}
          />
          <input
            type="number"
            name="maxMarks"
            value={form.maxMarks}
            placeholder="Max marks"
            onChange={handleChange}
            className="border rounded-md p-2 text-sm"
            disabled={loading}
          />
        </div>

        {/* Submission type */}
        <div>
          <label className="text-sm text-gray-700 dark:text-gray-300">
            Submission Type
          </label>
          <select
            name="submissionType"
            value={form.submissionType}
            onChange={handleChange}
            className="w-full border rounded-md p-2 text-sm mt-1"
            disabled={loading}
          >
            <option value="file">File Upload</option>
            <option value="text">Text Submission</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
          aria-label="Cancel Assignment Creation"
            onClick={onClose}
            className="px-4 py-2 text-sm border rounded-md cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
          aria-label="Submit Assignment"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md cursor-pointer"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
}
