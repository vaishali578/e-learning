// Course
//  └── Section
//       └── Quiz
//            ├── Questions
//            └── Attempts (per student)

import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    // BASIC INFO
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      default: "",
      maxlength: 1000,
    },

    // RELATION
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // QUIZ CONFIG
    timeLimit: {
      type: Number, // minutes
      min: 1,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    passMarks: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.totalMarks;
        },
        message: "Pass marks cannot exceed total marks",
      },
    },

    allowedAttempts: {
      type: Number,
      default: 1,
      min: 1,
    },

    shuffleQuestions: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      required: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Unique quiz order per section
quizSchema.index({ section: 1, order: 1 }, { unique: true });

export default mongoose.model("Quiz", quizSchema);

