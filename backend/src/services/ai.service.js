// ai.service.js
const axios = require("axios");
const { z } = require("zod");
const pdfParse = require("pdf-parse");

// Schema for validation
const interviewreportSchema = z.object({
  title: z.string(),
  matchScore: z.number(),
  technicalQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  behavioralQuestions: z.array(
    z.object({
      question: z.string(),
      intention: z.string(),
      answer: z.string(),
    })
  ),
  skillGaps: z.array(
    z.object({
      skill: z.string(),
      severity: z.enum(["low", "medium", "high"]),
    })
  ),
  preparationPlan: z.array(
    z.object({
      day: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
    })
  ),
});

// AI call function
const aiCall = async (prompt) => {
  try {
    const response = await axios.post(
      process.env.GENAI,
      {
        model: process.env.AI_MODEL,
        temperature: 0.2,
        messages: [
          { role: "system", content: "You are a strict JSON generator. Always return valid JSON only." },
          { role: "user", content: prompt },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response?.data?.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      throw new Error("Invalid AI response");
    }

    return content;
  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);
    throw new Error("AI request failed");
  }
};

// Extract JSON from AI text
const extractJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in AI response");
  return match[0];
};

// MAIN: Generate Interview Report
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  if (!resume) throw new Error("Resume file missing");

  // 1️⃣ Parse PDF
  const pdfData = await pdfParse(resume.buffer);
  const resumeText = pdfData.text;

  // 2️⃣ Build AI prompt
  const prompt = `
Generate interview report in STRICT JSON format.

Schema:
{
  "title": "string",
  "matchScore": number,
  "technicalQuestions": [{ "question": "", "intention": "", "answer": "" }],
  "behavioralQuestions": [{ "question": "", "intention": "", "answer": "" }],
  "skillGaps": [{ "skill": "", "severity": "low|medium|high" }],
  "preparationPlan": [{ "day": number, "focus": "", "tasks": [""] }]
}

Resume: ${resumeText}
Self: ${selfDescription}
Job: ${jobDescription}
`;

  // 3️⃣ Call AI
  const raw = await aiCall(prompt);
  console.log("RAW AI RESPONSE:", raw);

  // 4️⃣ Extract & validate JSON
  try {
    const jsonString = extractJSON(raw);
    const parsed = JSON.parse(jsonString);

    if (!parsed.title) parsed.title = jobDescription?.split("\n")[0] || "Software Engineer";

    const validated = interviewreportSchema.parse(parsed);
    return validated;
  } catch (err) {
    console.error("PARSE ERROR:", err.message);
    console.log("RAW AI:", raw);
    throw new Error("Failed to parse AI response");
  }
}

module.exports = { generateInterviewReport };