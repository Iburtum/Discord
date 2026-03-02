const ModelClient = require("@azure-rest/ai-inference").default;
const { isUnexpected } = require("@azure-rest/ai-inference");
const { AzureKeyCredential } = require("@azure/core-auth");
const { SYSTEM_PROMPT } = require("./knowledge");

const ENDPOINT = "https://models.github.ai/inference";
const MODEL = "openai/gpt-4.1-mini";

/**
 * Send a user message to the AI model and return the assistant reply.
 * @param {string} userMessage
 * @returns {Promise<string>}
 */
async function chat(userMessage) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not set");
  }

  const client = ModelClient(ENDPOINT, new AzureKeyCredential(token));

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.7,
      top_p: 1,
      max_tokens: 1024,
      model: MODEL,
    },
  });

  if (isUnexpected(response)) {
    const body = response.body;
    const detail =
      body?.error?.message ||
      (typeof body === "string" ? body : JSON.stringify(body));
    throw new Error(`AI request failed (${response.status}): ${detail}`);
  }

  return response.body.choices[0].message.content;
}

module.exports = { chat };
