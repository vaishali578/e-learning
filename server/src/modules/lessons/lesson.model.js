import mongoose from "mongoose";

/* ===== RESOURCE SCHEMA ===== */
const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["pdf", "link", "zip", "code"],
      required: true,
    },
  },
  { _id: false }
);

/* ===== LESSON SCHEMA ===== */
const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, default: "", maxlength: 1000 },

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

    type: {
      type: String,
      enum: ["video", "article", "live"],
      required: true,
    },

    /* ===== VIDEO ===== */
    video: {
      url: { type: String },
      duration: { type: Number }, // seconds
      provider: {
        type: String,
        enum: ["youtube", "vimeo", "s3", "wasabi", "cloudinary"],
        default: "cloudinary",
      },
    },

    /* ===== ARTICLE ===== */
    content: { type: String },

    /* ===== LIVE ===== */
    liveClass: {
      meetingUrl: { type: String },
      startTime: { type: Date },
      duration: { type: Number },
      platform: {
        type: String,
        enum: ["zoom", "google-meet", "teams", "custom"],
      },
      recordingUrl: { type: String },
    },

    resources: [resourceSchema],

    order: { type: Number, required: true },

    isPreview: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ===== INDEXES ===== */
lessonSchema.index({ section: 1, order: 1 }, { unique: true });
lessonSchema.index({ course: 1, section: 1 });

/* ===== VALIDATION ===== */
lessonSchema.pre("validate", function () {
  if (this.type === "video") {
    if (
      !this.video ||
      !this.video.url ||
      this.video.duration === undefined
    ) {
      throw new Error("Video URL and duration are required for video lessons");
    }
  }

  if (this.type === "article" && !this.content) {
    throw new Error("Content is required for article lessons");
  }

  if (this.type === "live") {
    if (
      !this.liveClass ||
      !this.liveClass.meetingUrl ||
      !this.liveClass.startTime
    ) {
      throw new Error("Meeting URL and start time are required for live lessons");
    }
  }
});

export default mongoose.model("Lesson", lessonSchema);


// Course
//  └── Section
//       └── Content (ordered items)
//            ├── Lesson
//            │     ├── type: video | article | live
//            │     ├── duration
//            │     └── resources
//            ├── Assignment
//            │     ├── instructions
//            │     ├── dueDate
//            │     ├── maxMarks
//            │     └── submissions (student-specific)
//            └── Quiz
//                  ├── questions
//                  └── attempts (student-specific)
