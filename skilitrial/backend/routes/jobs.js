import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/role.js";

const router = express.Router();

/* ================= PUBLIC ================= */
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiter", "name company");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= CANDIDATE APPLY ================= */
router.post(
  "/:jobId/apply",
  authMiddleware,
  roleMiddleware("candidate"),
  async (req, res) => {
    try {
      const existing = await Application.findOne({
        job: req.params.jobId,
        candidate: req.user.id,
      });

      if (existing) {
        return res.status(400).json({ message: "Already applied to this job" });
      }

      const application = await Application.create({
        job: req.params.jobId,
        candidate: req.user.id,
      });

      res.json(application);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* ================= RECRUITER ================= */

// Post job
router.post(
  "/",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const job = await Job.create({
        ...req.body,
        recruiter: req.user.id,
      });

      res.json(job);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get recruiter jobs
router.get(
  "/my-jobs",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const jobs = await Job.find({ recruiter: req.user.id });
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Get applicants for specific job
router.get(
  "/:jobId/applicants",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const applications = await Application.find({
        job: req.params.jobId,
      }).populate("candidate", "name email");

      res.json(applications);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Secure update application status (shortlist / reject)
router.put(
  "/application/:id",
  authMiddleware,
  roleMiddleware("recruiter"),
  async (req, res) => {
    try {
      const application = await Application.findById(req.params.id).populate("job");

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Ensure recruiter owns the job
      if (application.job.recruiter.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      application.status = req.body.status;
      await application.save();

      res.json(application);

    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;