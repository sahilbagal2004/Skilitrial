import mongoose from "mongoose";

const trialSchema = new mongoose.Schema({
  fileUrl: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Trial", trialSchema);