import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    // ===== BASIC INFO =====
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    topic: {
      type: String,
      required: true,
      trim: true,
    },

    // ===== TIMING =====
    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number, // in minutes
      required: true,
      min: 5,
      max: 480,
    },

    // ===== RECURRENCE =====
    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurrencePattern: {
      type: String,
      enum: ["daily", "weekly", "biweekly", "monthly", "none"],
      default: "none",
    },

    recurrenceEndDate: {
      type: Date,
      default: null,
    },

    daysOfWeek: [
      {
        type: Number, // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        min: 0,
        max: 6,
      },
    ],

    // ===== RELATION =====
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },

    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      default: null,
    },

    // ===== MEETING DETAILS =====
    meetingLink: {
      type: String,
      default: "",
      trim: true,
    },

    platformType: {
      type: String,
      enum: ["zoom", "meet", "teams", "custom", "none"],
      default: "none",
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    // ===== CAPACITY =====
    maxCapacity: {
      type: Number,
      default: null,
    },

    attendedCount: {
      type: Number,
      default: 0,
    },

    // ===== RSVP & ATTENDANCE =====
    rsvps: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["attending", "not_attending", "maybe"],
          default: "attending",
        },
        rsvpedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    attendance: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        presentAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["present", "absent", "late"],
          default: "present",
        },
      },
    ],

    // ===== STATUS =====
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
      index: true,
    },

    isCancelled: {
      type: Boolean,
      default: false,
    },

    cancellationReason: {
      type: String,
      default: "",
    },

    // ===== NOTES =====
    notes: {
      type: String,
      default: "",
    },

    tags: [String],

    // ===== TIMESTAMPS =====
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for queries
scheduleSchema.index({ course: 1, trainer: 1 });
scheduleSchema.index({ startDate: 1, status: 1 });
scheduleSchema.index({ "rsvps.student": 1 });

export default mongoose.model("Schedule", scheduleSchema);
