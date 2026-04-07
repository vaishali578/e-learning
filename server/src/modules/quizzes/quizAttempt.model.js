import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    answers: [
      {
        question: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedOptions: [Number], // indexes
        isCorrect: Boolean,
        marksObtained: Number,
      },
    ],

    startedAt: {
      type: Date,
      default: Date.now,
    },

    submittedAt: {
      type: Date,
    },

    totalMarksObtained: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["in_progress", "submitted", "evaluated"],
      default: "in_progress",
    },
  },
  {
    timestamps: true,
  }
);

// Limit attempts
quizAttemptSchema.index(
  { quiz: 1, student: 1, submittedAt: 1 }
);

export default mongoose.model("QuizAttempt", quizAttemptSchema);
