import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  from: Date,
  to: Date,
  current: Boolean,
  description: String,
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["candidate", "recruiter", "admin"],
      default: "candidate",
    },

    headline: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    company: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    skills: [
      {
        type: String,
      },
    ],

    experience: [experienceSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;