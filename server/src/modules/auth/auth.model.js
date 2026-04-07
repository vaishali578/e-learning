import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    index: true 
  },

  password: { 
    type: String, 
    required: true, 
    minlength: 6, 
    select: false 
  },

  role: { 
    type: String, 
    enum: ["student", "trainer", "admin"], 
    default: "student" 
  },

  // 🔹 Profile Info
  bio: { type: String },
  skills: { type: [String], default: [] },

  phone: { 
    type: String, 
    trim: true,
    default: null
  },

  dob: { 
    type: Date,
    default: null
  },

  // 🔹 Social Links
  linkedin: { type: String, trim: true },
  github: { type: String, trim: true },
  twitter: { type: String, trim: true },

  // 🔹 System fields
  permissions: { type: [String], default: [] },

  profilePhoto: { 
    type: String, 
    default: null 
  },

}, { timestamps: true });


// 🔐 Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// 🔍 Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
