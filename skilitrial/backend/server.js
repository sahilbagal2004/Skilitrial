import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import jobRoutes from "./routes/jobs.js";
import uploadRoute from "./routes/upload.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors({
  origin: process.env.CLIENT_URL || true,
  credentials: true
}));

app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/upload", uploadRoute);

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.send("Skilitrial API Running 🚀");
});

/* ================= DB CONNECT ================= */

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "skilitrial_v2"
  })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("Mongo Error:", err));

/* ================= GLOBAL ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});