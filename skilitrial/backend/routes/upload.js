import express from "express";
import multer from "multer";
import cloudinary from "../cloudinary.js";
import Trial from "../models/Trial.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      async (error, result) => {
        if (error) return res.status(500).json({ error });

        const trial = new Trial({
          fileUrl: result.secure_url,
        });

        await trial.save();
        res.json(trial);
      }
    );

    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;