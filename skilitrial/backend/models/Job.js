import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: String,
      required: true,
      trim: true,
    },

    companyLogo: {
      type: String,   // 💎 NEW FIELD (store logo URL)
      default: "",
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    salary: {
      type: String,
      default: "Not Disclosed",
    },

    description: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["Remote", "Hybrid", "Onsite"],
      required: true,
    },

    experienceLevel: {
      type: String,
      enum: ["Fresher", "1-3 years", "3-5 years", "5+ years"],
      default: "Fresher",
    },

    requirements: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    applicationLink: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },

    applicantsCount: {
      type: Number,
      default: 0,  // 📊 NEW FIELD
    },

    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);