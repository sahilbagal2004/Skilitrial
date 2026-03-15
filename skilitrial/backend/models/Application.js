import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected"],
      default: "applied",
    },

    trialStatus: {
      type: String,
      enum: ["pending_trial", "completed", "not_required"],
      default: "not_required",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);