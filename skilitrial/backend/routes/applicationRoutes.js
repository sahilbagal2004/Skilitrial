import express from "express";
import Application from "../models/Application.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { jobId } = req.body;
    const candidateId = req.user.id;

    const existing = await Application.findOne({
      job: jobId,
      candidate: candidateId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already Applied" });
    }

    const newApplication = new Application({
      job: jobId,
      candidate: candidateId,
    });

    await newApplication.save();

    res.status(201).json({ message: "Applied Successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/my-applications", authMiddleware, async (req, res) => {
  try {
    const applications = await Application.find({
      candidate: req.user.id,
    });

    res.json(applications);

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;