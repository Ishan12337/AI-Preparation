
const axios = require("axios");
const { z } = require("zod");

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

// Strong AI Call
const aiCall = async (prompt) => {
  try {
    const response = await axios.post(
      process.env.GENAI,
      {
        model: process.env.AI_MODEL,
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content:
              "You are a strict JSON generator. Always return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
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

// JSON Extractor (safer)
const extractJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/);

  if (!match) {
    throw new Error("No JSON found");
  }

  return match[0];
};

// MAIN
async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
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

Resume: ${resume}
Self: ${selfDescription}
Job: ${jobDescription}
`;

  const raw = await aiCall(prompt);
  console.log("RAW AI RESPONSE:", raw);

  try {
    const jsonString = extractJSON(raw);
    const parsed = JSON.parse(jsonString);

    // fallback title
    if (!parsed.title) {
      parsed.title =
        jobDescription?.split("\n")[0] || "Software Engineer";
    }

    const validated = interviewreportSchema.parse(parsed);

    return validated;
  } catch (err) {
    console.error("PARSE ERROR:", err.message);
    console.log("RAW AI:", raw);

    throw new Error("Failed to parse AI response");
  }
}

module.exports = { generateInterviewReport };

