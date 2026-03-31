const axios = require("axios");
const { z } = require("zod");
const pdfParse = require("pdf-parse");

// JSON schema
const interviewreportSchema = z.object({
  title: z.string(),
  matchScore: z.number(),
  technicalQuestions: z.array(z.object({ question: z.string(), intention: z.string(), answer: z.string() })),
  behavioralQuestions: z.array(z.object({ question: z.string(), intention: z.string(), answer: z.string() })),
  skillGaps: z.array(z.object({ skill: z.string(), severity: z.enum(["low", "medium", "high"]) })),
  preparationPlan: z.array(z.object({ day: z.number(), focus: z.string(), tasks: z.array(z.string()) })),
});

// Call OpenRouter
const aiCall = async (prompt) => {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions", // OpenRouter endpoint
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
  if (!content) throw new Error("No AI response");
  return content;
};

// JSON extract
const extractJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found");
  return match[0];
};

// Generate report
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
  if (!resume) throw new Error("Resume missing");

  const pdfData = await pdfParse(resume.buffer);
  const resumeText = pdfData.text;

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

  const raw = await aiCall(prompt);
  const jsonString = extractJSON(raw);
  const parsed = JSON.parse(jsonString);

  return interviewreportSchema.parse(parsed);
}

module.exports = { generateInterviewReport };