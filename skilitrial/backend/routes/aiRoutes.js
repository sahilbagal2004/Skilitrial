import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

const getGenAI = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured in .env");
  }
  return new GoogleGenerativeAI(key);
};

// ================= ANALYZE PROFILE =================
// POST /api/ai/analyze-profile
// Body: { name, headline, bio, location, skills, experience }
router.post("/analyze-profile", authMiddleware, async (req, res) => {
  try {
    const { name, headline, bio, skills, experience } = req.body;

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const experienceText = Array.isArray(experience) && experience.length > 0
      ? experience.map(e => `${e.title} at ${e.company}${e.description ? ` — ${e.description}` : ""}`).join("\n")
      : "None listed";

    const skillsText = Array.isArray(skills) && skills.length > 0
      ? skills.join(", ")
      : "None listed";

    const prompt = `
You are a professional career coach and recruiter at a top tech firm. Analyze the following candidate profile and provide actionable, specific feedback.

Candidate Profile:
- Name: ${name || "N/A"}
- Headline: ${headline || "Not set"}
- Bio: ${bio || "Not written"}
- Skills: ${skillsText}
- Experience:
${experienceText}

Please respond in STRICT valid JSON format (no markdown, no code blocks, just raw JSON) with this exact structure:
{
  "score": <number from 1 to 100 representing overall profile strength>,
  "grade": "<A, B, C, D or F>",
  "summary": "<2-3 sentence executive summary of the profile>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<specific actionable improvement 1>", "<specific actionable improvement 2>", "<specific actionable improvement 3>"],
  "suggestedSkills": ["<skill the candidate should consider adding 1>", "<skill 2>", "<skill 3>"],
  "headlineRewrite": "<a better, improved version of the headline if the current one is weak, or null if it's already good>"
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Strip any markdown code blocks if Gemini wraps it
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    res.json(parsed);

  } catch (error) {
    console.error("AI Analyze Error:", error.message);
    if (error.message.includes("GEMINI_API_KEY")) {
      return res.status(503).json({ message: "AI service not configured. Please add your Gemini API key." });
    }
    res.status(500).json({ message: "AI analysis failed. Please try again." });
  }
});

// ================= EVALUATE TRIAL RESPONSE =================
// POST /api/ai/evaluate-trial
// Body: { trialType, response }
router.post("/evaluate-trial", authMiddleware, async (req, res) => {
  try {
    const { trialType, response: candidateResponse } = req.body;

    if (!candidateResponse || candidateResponse.trim().length < 20) {
      return res.status(400).json({ message: "Response is too short to evaluate." });
    }

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a senior hiring manager evaluating a candidate's ${trialType || "customer support"} trial submission.

Candidate's Response:
"${candidateResponse}"

Evaluate this response and respond in STRICT valid JSON format (no markdown code blocks):
{
  "score": <number 1-100>,
  "grade": "<A, B, C, D or F>",
  "summary": "<2 sentences overall evaluation>",
  "positives": ["<positive aspect 1>", "<positive aspect 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "wouldHire": <true or false>
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const cleaned = text.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    res.json(parsed);

  } catch (error) {
    console.error("AI Evaluate Error:", error.message);
    if (error.message.includes("GEMINI_API_KEY")) {
      return res.status(503).json({ message: "AI service not configured." });
    }
    res.status(500).json({ message: "AI evaluation failed." });
  }
});

export default router;
