const https = require("https");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { topic, platform, contentType, tone } = JSON.parse(event.body);

    const prompt = `You are a world-class content strategist. Generate exactly 7 hooks for: Topic: ${topic}, Platform: ${platform}, Content Type: ${contentType}, Tone: ${tone}. Styles IN ORDER: 1.The Pattern Interrupt 2.The Bold Claim 3.The Curiosity Gap 4.The Contrarian Take 5.The Relatable Pain 6.The Data Hook 7.The Story Open. Rules: under 280 chars each, no emojis unless fitting, no generic openers. Respond ONLY valid JSON: {"hooks":[{"style":"...","text":"..."}]}`;

    const body = JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    });

    const result = await new Promise((resolve, reject) => {
      const req = https.request({
        hostname: "api.anthropic.com",
        path: "/v1/messages",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "Content-Length": Buffer.byteLength(body)
        }
      }, (res) => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => resolve(data));
      });
      req.on("error", reject);
      req.write(body);
      req.end();
    });

    const parsed = JSON.parse(result);
    const text = parsed.content[0].text.replace(/```json|```/g, "").trim();
    const hooks = JSON.parse(text);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hooks)
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to generate hooks. Try again." })
    };
  }
};
