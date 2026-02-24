import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import jobRoutes from "./routes/jobs.js";
import uploadRoute from "./routes/upload.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

console.log("Mongo URI:", process.env.MONGO_URI);

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/jobs", jobRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "skilitrial_v2"
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/test", (req, res) => {
  res.send("Backend test working");
});

app.listen(process.env.PORT || 5000, "0.0.0.0", () =>
  console.log("Server running on port 5000")
);