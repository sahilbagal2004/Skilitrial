import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    company: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: String,
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
    },

    requirements: [
      {
        type: String,
      }
    ],

    skills: [
      {
        type: String,
      }
    ],

    applicationLink: {
      type: String,
    },

    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
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