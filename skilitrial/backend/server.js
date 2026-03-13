import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import jobRoutes from "./routes/jobs.js";
import uploadRoute from "./routes/upload.js";
import authRoutes from "./routes/auth.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import paymentRoutes from "./routes/payment.js";

const app = express();

/* ================= CORS ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://skilitrial.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/applications", applicationRoutes);
app.use("/api/payment", paymentRoutes);

/* ================= TEST ROUTE ================= */

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

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});