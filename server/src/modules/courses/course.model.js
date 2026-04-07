import mongoose from "mongoose";
import slugify from "slugify";

const courseSchema = new mongoose.Schema(
  {
    // ===== BASIC INFO =====
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    thumbnail: {
      type: String, // S3 / Cloudinary
      default: "",
    },

    previewVideo: {
      type: String, // intro video url
      default: "",
    },

    // ===== RELATION =====
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],

    // ===== PRICING =====
    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    language: {
      type: String,
      default: "English",
    },

    category: {
      type: String,
      index: true,
    },

    tags: [
      {
        type: String,
        index: true,
      },
    ],

    // ===== STATUS =====
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },

    needsRepublish: {
      type: Boolean,
      default: false,
      index: true,
    },

    lastPublishedAt: {
      type: Date,
      default: null,
    },

    // ===== STATS =====
    totalStudents: {
      type: Number,
      default: 0,
    },

    totalLessons: {
      type: Number,
      default: 0,
    },

    totalDuration: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// ===== SLUG GENERATION =====
courseSchema.pre("save", async function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

export default mongoose.model("Course", courseSchema);
