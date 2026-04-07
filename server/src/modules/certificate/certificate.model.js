import mongoose from "mongoose";
import crypto from "crypto";

const certificateSchema = new mongoose.Schema(
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

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // trainer / organization
    },

    certificateId: {
      type: String,
      unique: true,
      index: true,
    },

    certificateNumber: {
      type: String,
      unique: true,
    },

    grade: {
      type: String,
      enum: ["A", "B", "C", "Pass", "Distinction"],
    },

    score: {
      type: Number, // final score %
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    validUntil: {
      type: Date, // Optional (mostly null)
    },

    certificateUrl: {
      type: String, // PDF / image
      required: true,
    },

    verificationUrl: {
      type: String,
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },

    revokedReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// One certificate per student per course
certificateSchema.index(
  { student: 1, course: 1 },
  { unique: true }
);

// Auto generate unique IDs
certificateSchema.pre("save", function (next) {
  if (!this.certificateId) {
    this.certificateId = crypto.randomUUID();
  }

  if (!this.certificateNumber) {
    this.certificateNumber = `CERT-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;
  }

  next();
});

export default mongoose.model("Certificate", certificateSchema);
