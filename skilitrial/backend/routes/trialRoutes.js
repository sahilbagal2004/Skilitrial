import express from "express";
import Application from "../models/Application.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= COMPLETE SKILL TRIAL =================
// Called when a candidate finishes a required skill trial
router.post("/complete-trial", authMiddleware, async (req, res) => {
  try {
    const candidateId = req.user.id;
    // We update any application by this candidate that is currently pending_trial.
    // In a more complex app, we might pass the specific application ID or job ID.
    // For simplicity, we assume finishing a trial completes any pending application for that specific trial.
    // To match correctly, we would ideally pass the trial route or application ID. Let's pass `applicationId` if possible, 
    // but globally updating pending trials for the candidate is a safe fallback for this beta.

    const { applicationId } = req.body;

    if (applicationId) {
       await Application.findByIdAndUpdate(applicationId, { trialStatus: "completed" });
    } else {
       // Fallback: update all pending applications for this user
       await Application.updateMany(
         { candidate: candidateId, trialStatus: "pending_trial" },
         { $set: { trialStatus: "completed" } }
       );
    }

    res.status(200).json({ message: "Trial marked as completed." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
