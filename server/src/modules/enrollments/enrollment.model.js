import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
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

    enrolledAt: {
      type: Date,
      default: Date.now,
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "expired"],
      default: "active",
      index: true,
    },

    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    completedAt: {
      type: Date,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    isCertificateIssued: {
      type: Boolean,
      default: false,
    },

    accessUntil: {
      type: Date, // lifetime course -> null
    },
  },
  {
    timestamps: true,
  }
);

// 🚫 Prevent duplicate enrollment
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

enrollmentSchema.pre("save", function () {
  if (this.status === "completed" && !this.completedAt) {
    this.completedAt = new Date();
    this.progressPercentage = 100;
  }
});


export default mongoose.model("Enrollment", enrollmentSchema);
