export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "HTTP-Referer": "https://prepplus.org",
      "X-Title": "Prep+",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b:free",
      max_tokens: 4000,
      messages: body.messages,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("OpenRouter error:", JSON.stringify(data));
    return res.status(500).json({ error: data });
  }

  const text = data.choices?.[0]?.message?.content || "";
  return res.status(200).json({ content: [{ text }] });
}
