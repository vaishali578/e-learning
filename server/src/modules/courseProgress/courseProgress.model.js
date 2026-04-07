import mongoose from "mongoose";

const completedItemSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    itemType: {
      type: String,
      enum: ["lesson", "quiz", "assignment"],
      required: true,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const courseProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    completedItems: [completedItemSchema],

    lastAccessedSection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },

    lastAccessedItem: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

courseProgressSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model("CourseProgress", courseProgressSchema);