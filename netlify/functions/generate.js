exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { topic, platform, contentType, tone } = JSON.parse(event.body);

    if (!topic) {
      return { statusCode: 400, body: JSON.stringify({ error: "Topic is required" }) };
    }

    const prompt = `You are a world-class content strategist who writes viral hooks for creators.

Generate exactly 7 high-converting hooks for:
- Topic: ${topic}
- Platform: ${platform}
- Content Type: ${contentType}
- Tone: ${tone}

Each hook must match one of these styles IN ORDER:
1. The Pattern Interrupt
2. The Bold Claim
3. The Curiosity Gap
4. The Contrarian Take
5. The Relatable Pain
6. The Data Hook
7. The Story Open

Rules:
- Each hook must be under 280 characters
- No emojis unless naturally fitting
- No generic openers like "Have you ever..." or "In today's post..."
- Make each feel like it stops someone mid-scroll
- Be specific, not vague

Respond ONLY with valid JSON. No markdown, no backticks, no preamble.
Format: {"hooks":[{"style":"The Pattern Interrupt","text":"..."},{"style":"The Bold Claim","text":"..."},{"style":"The Curiosity Gap","text":"..."},{"style":"The Contrarian Take","text":"..."},{"style":"The Relatable Pain","text":"..."},{"style":"The Data Hook","text":"..."},{"style":"The Story Open","text":"..."}]}`;

   const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": process.env.ANTHROPIC_API_KEY,
    "anthropic-version": "2023-06-01",
  },
  body: JSON.stringify({
    model: "claude-3-haiku-20240307",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  }),
});

const data = await response.json();

// VERY IMPORTANT
if (!response.ok) {
  console.log("API ERROR:", data);
  return {
    statusCode: 500,
    body: JSON.stringify({ error: "API failed" }),
  };
}
    const raw = (data.content || []).map((i) => i.text || "").join("").trim();
    const clean = raw.replace(/```json|```/g, "").trim();
    let parsed;

try {
  parsed = JSON.parse(clean);
} catch (e) {
  return {
    statusCode: 500,
    body: JSON.stringify({ error: "Bad AI response" }),
  };
}
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate hooks. Try again." }),
    };
  }
};
