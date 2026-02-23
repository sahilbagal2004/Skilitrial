const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
console.log("Mongo URI:", process.env.MONGO_URI);
const jobRoutes = require("./routes/jobs");

const app = express();

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions)); // ✅ This is enough

app.use(express.json());

app.use("/api/jobs", jobRoutes);

mongoose.connect(process.env.MONGO_URI, {
  dbName: "skilitrial_v2"
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.get("/", (req, res) => {
  res.send("API Running");
});

app.get("/test", (req, res) => {
  res.send("Backend test working");
});

app.use("/api/auth", require("./routes/auth"));

app.listen(process.env.PORT || 5000, "0.0.0.0", () =>
  console.log("Server running on port 5000")
);
