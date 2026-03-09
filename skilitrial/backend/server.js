import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import jobRoutes from "./routes/jobs.js";
import uploadRoute from "./routes/upload.js";
import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();

/* ================= CORS ================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://skilitria.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

/* ================= MIDDLEWARE ================= */

app.use(express.json());

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/applications", applicationRoutes);
app.use("/api/payment", paymentRoutes);

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.send("Skilitrial API Running 🚀");
});

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "skilitrial_v2"
  })
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("Mongo Error:", err));

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});