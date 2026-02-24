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
    location: String,
    salary: String,
    applyLink: String,
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;