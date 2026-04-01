const aiCall = async (prompt) => {
  console.log("KEY:", !!process.env.OPENROUTER_API_KEY, "MODEL:", process.env.AI_MODEL);

  try {
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

    const content = response?.data?.choices?.[0]?.message?.content;
    if (!content) {
      console.log("RAW AI RESPONSE:", response.data);
      throw new Error("No AI response");
    }
    return content;
  } catch (err) {
    console.error("AI CALL ERROR:", err.response?.data || err.message);
    throw new Error("AI request failed");
  }
};