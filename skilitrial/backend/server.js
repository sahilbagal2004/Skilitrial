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
import trialRoutes from "./routes/trialRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

/* ================= CORS ================= */

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://skilitrial.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.) or from allowed origins
    if (!origin || allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
      callback(null, origin || "*");
    } else {
      callback(null, origin); // Allow all for now
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests for all routes
app.options("*", cors(corsOptions));

/* ================= MIDDLEWARE ================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/applications", applicationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/trials", trialRoutes);
app.use("/api/ai", aiRoutes);

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