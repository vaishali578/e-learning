// Course
//  └── Section
//       └── Assignment
//            ├── Instructions
//            ├── Submission (file / text / link)
//            ├── Due date
//            ├── Marks & feedback




import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["file", "text", "link"],
      required: true,
    },

    content: {
      type: String, // file URL / text answer / link
      required: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    marksObtained: {
      type: Number,
      default: null,
    },

    feedback: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const assignmentSchema = new mongoose.Schema(
  {
    // BASIC INFO
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    instructions: {
      type: String,
      required: true,
      maxlength: 3000,
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
      required: true, // trainer
    },

    // ASSIGNMENT CONFIG
    submissionType: {
      type: String,
      enum: ["file", "text", "link", "mixed"],
      default: "file",
    },

    maxMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    dueDate: {
      type: Date,
    },

    order: {
      type: Number,
      required: true,
    },

    // STUDENT DATA
    submissions: [submissionSchema],

    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Unique assignment order per section
assignmentSchema.index({ section: 1, order: 1 }, { unique: true });

export default mongoose.model("Assignment", assignmentSchema);

