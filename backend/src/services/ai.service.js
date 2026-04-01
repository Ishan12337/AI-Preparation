// ai.service.js
const axios = require("axios");
const { z } = require("zod");
//const pdfParse = require("pdf-parse");
//const pdfParse = require("pdf-parse").default || require("pdf-parse");
//const pdfParseLib = require("pdf-parse");
//const pdfParse = pdfParseLib.default || pdfParseLib;
const pdfParse = (...args) => import("pdf-parse").then(m => m.default(...args));



// Strict JSON schema
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

// ---------------- AI CALL ----------------
const aiCall = async (prompt) => {
  try {
    console.log(
      "AI CALL -> KEY SET:", !!process.env.OPENROUTER_API_KEY,
      "MODEL:", process.env.AI_MODEL
    );

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
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

    console.log("AI FULL RESPONSE:", response.data);

    const content = response?.data?.choices?.[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("No valid content in AI response");
    }

    return content;
  } catch (error) {
    console.error("AI CALL ERROR:", error.response?.data || error.message);
    throw new Error("AI request failed");
  }
};

// ---------------- JSON EXTRACT ----------------
const extractJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in AI response");
  return match[0];
};

// ---------------- GENERATE INTERVIEW REPORT ----------------
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  if (!resume) throw new Error("Resume file missing");

  // 1️⃣ Parse PDF
  console.log("Parsing PDF...");
  //const pdfData = await pdfParse(resume.buffer);
  const pdfData = await pdfParse(resume.buffer);
  const resumeText = pdfData.text;
  console.log("TYPE OF pdfParse:", typeof pdfParse);

  // 2️⃣ Build AI prompt
//   const prompt = `
// Generate interview report in STRICT JSON format.

// Schema:
// {
//   "title": "string",
//   "matchScore": number,
//   "technicalQuestions": [{ "question": "", "intention": "", "answer": "" }],
//   "behavioralQuestions": [{ "question": "", "intention": "", "answer": "" }],
//   "skillGaps": [{ "skill": "", "severity": "low|medium|high" }],
//   "preparationPlan": [{ "day": number, "focus": "", "tasks": [""] }]
// }

// Resume: ${resumeText}
// Self: ${selfDescription}
// Job: ${jobDescription}
// `;
const prompt = `
Return ONLY valid JSON.
Do NOT include any explanation or text outside JSON.

Rules:
- matchScore MUST be a number (not string)
- All fields must exist
- skillGaps severity must be one of: low, medium, high

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

  // 4️⃣ Extract JSON & validate
  try {
  //  const jsonString = extractJSON(raw);
  let jsonString;
try {
  jsonString = extractJSON(raw);
} catch (e) {
  console.error("NO JSON FOUND:", raw);
  throw new Error("AI returned invalid format");
}











    const parsed = JSON.parse(jsonString);

    // fallback title if missing
    if (!parsed.title) {
      parsed.title = jobDescription?.split("\n")[0] || "Software Engineer";
    }

   // const validated = interviewreportSchema.parse(parsed);
   // return validated;

//   try {
//   const validated = interviewreportSchema.parse(parsed);
//   return validated;
// } catch (err) {
//   console.error("ZOD ERROR:", err.errors);

 try {
  const validated = interviewreportSchema.parse(parsed);

  // 🔥 normalize score (important)
  validated.matchScore =
    validated.matchScore <= 1
      ? validated.matchScore * 100
      : validated.matchScore;

  return validated;

} catch (err) {
  console.error("ZOD ERROR:", err.errors);

  // 🔥 fallback (no crash)
  return {
    title: parsed.title || "Interview Report",
    matchScore: parsed.matchScore <= 1
      ? parsed.matchScore * 100
      : parsed.matchScore || 50,
    technicalQuestions: parsed.technicalQuestions || [],
    behavioralQuestions: parsed.behavioralQuestions || [],
    skillGaps: parsed.skillGaps || [],
    preparationPlan: parsed.preparationPlan || [],
  };
}


  
  return {
    title: parsed.title || "Interview Report",
    matchScore: Number(parsed.matchScore) || 50,
    technicalQuestions: parsed.technicalQuestions || [],
    behavioralQuestions: parsed.behavioralQuestions || [],
    skillGaps: parsed.skillGaps || [],
    preparationPlan: parsed.preparationPlan || [],
  };


  } catch (err) {
    console.error("PARSE ERROR:", err.message);
    console.log("RAW AI RESPONSE FOR DEBUG:", raw);
    throw new Error("Failed to parse AI response");
  }
}

module.exports = { generateInterviewReport };