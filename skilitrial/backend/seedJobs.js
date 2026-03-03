import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";
import User from "./models/User.js";

dotenv.config();

const companies = [
  "Google","Amazon","Microsoft","Flipkart","TCS",
  "Infosys","Wipro","Meesho","IBM","Adobe"
];

const companyLogos = {
  Google: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  Amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  Microsoft: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  Flipkart: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Flipkart_logo.png",
  TCS: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
  Infosys: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
  Wipro: "https://upload.wikimedia.org/wikipedia/commons/8/86/Wipro_Primary_Logo_Color_RGB.svg",
  Meesho: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Meesho_Logo.png",
  IBM: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  Adobe: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Adobe_Corporate_Logo.png"
};

const jobTitles = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "Software Engineer",
  "DevOps Engineer",
  "UI/UX Designer",
  "QA Engineer",
  "Cloud Engineer",
  "Product Manager"
];

const locations = [
  "Bangalore","Hyderabad","Mumbai",
  "Pune","Chennai","Delhi","Remote"
];

const experienceLevels = [
  "Fresher",
  "1-3 years",
  "3-5 years",
  "5+ years"
];

const types = ["Remote","Hybrid","Onsite"];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSalary() {
  return `${Math.floor(Math.random() * 20) + 6} LPA`;
}

async function seedJobs() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "skilitrial_v2"
    });

    console.log("MongoDB Connected");

    const user = await User.findOne();
    if (!user) {
      console.log("❌ No user found. Create a user first.");
      process.exit();
    }

    await Job.deleteMany({});
    console.log("Old jobs deleted");

    const jobs = [];

    for (let i = 0; i < 100; i++) {
      const company = randomItem(companies);

      jobs.push({
        title: randomItem(jobTitles),
        company,
        companyLogo: companyLogos[company] || "https://via.placeholder.com/50",
        location: randomItem(locations),
        salary: randomSalary(),
        description: "Looking for passionate professionals to join our team.",
        type: randomItem(types),
        experienceLevel: randomItem(experienceLevels),
        requirements: ["Problem Solving", "Team Collaboration"],
        skills: ["JavaScript", "Communication"],
        applicationLink: `https://${company.toLowerCase()}.com/careers`,
        status: "open",
        applicantsCount: 0,
        recruiter: user._id
      });
    }

    await Job.insertMany(jobs);

    console.log("🔥 100 Jobs Inserted Successfully!");
    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

seedJobs();