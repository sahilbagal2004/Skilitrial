import express from "express";
import Application from "../models/Application.js";
import Job from "../models/Job.js"; // ✅ Import Job model
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ================= APPLY FOR JOB =================
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user.id;

    if (!jobId) {
      return res.status(400).json({ message: "Job ID is required" });
    }

    // 🔹 Check if already applied
    const existing = await Application.findOne({
      job: jobId,
      candidate: candidateId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already Applied" });
    }

    // 🔹 Fetch the job to check for requiredTrial
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔹 Determine trial status
    const trialStatus = job.requiredTrial ? "pending_trial" : "not_required";

    // 🔹 Create application
    const newApplication = new Application({
      job: jobId,
      candidate: candidateId,
      trialStatus: trialStatus,
    });

    await newApplication.save();

    // 🔥 Increment applicants count
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicantsCount: 1 },
    });

    res.status(201).json({ 
      message: job.requiredTrial ? "Trial Required" : "Applied Successfully",
      requiredTrial: job.requiredTrial,
      applicationId: newApplication._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ================= GET MY APPLICATIONS =================
router.get("/my-applications", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id,
    }).populate("job"); // 🔥 populate job details

    res.json(applications);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;