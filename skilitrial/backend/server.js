const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: "*"
}));


app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
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
