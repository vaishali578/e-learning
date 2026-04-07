import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    text: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["mcq", "multi_select", "true_false"],
      required: true,
    },

    options: [
      {
        text: String,
        isCorrect: Boolean,
      },
    ],

    marks: {
      type: Number,
      required: true,
    },

    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure order uniqueness
questionSchema.index({ quiz: 1, order: 1 }, { unique: true });

export default mongoose.model("Question", questionSchema);
