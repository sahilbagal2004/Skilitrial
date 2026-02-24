import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;