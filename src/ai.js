const ModelClient = require("@azure-rest/ai-inference").default;
const { isUnexpected } = require("@azure-rest/ai-inference");
const { AzureKeyCredential } = require("@azure/core-auth");
const { SYSTEM_PROMPT } = require("./knowledge");
const { searchWiki } = require("./search");

const ENDPOINT = "https://models.github.ai/inference";
const MODEL = "openai/gpt-4.1-mini";

/**
 * Reply sent to the user when the AI model filters/blocks the response.
 * Shown in both Arabic and English.
 */
const FILTERED_REPLY =
  "⚠️ عذراً، لم أتمكن من الإجابة على هذا الطلب لأنه يتعارض مع سياسات المحتوى. جرّب إعادة صياغة سؤالك! 😅\n" +
  "⚠️ Sorry, I couldn't answer that one — it was flagged by content filters. Try rephrasing your question! 😅";

/**
 * Send a user message to the AI model and return the assistant reply.
 * Optionally fetches fresh context from the EliteMobs wiki first.
 *
 * @param {string} userMessage
 * @param {{ useWiki?: boolean }} [options]
 * @returns {Promise<string>}
 */
async function chat(userMessage, { useWiki = true } = {}) {
  const token = process.env.GH_MODELS_TOKEN;
  if (!token) {
    throw new Error("GH_MODELS_TOKEN is not set");
  }

  // Optionally enrich the system prompt with live wiki content
  let systemPrompt = SYSTEM_PROMPT;
  if (useWiki) {
    try {
      const wikiContent = await searchWiki(userMessage);
      if (wikiContent) {
        systemPrompt +=
          `\n\n=== Live Wiki Results for: "${userMessage}" ===\n` +
          wikiContent +
          `\n=== End of Live Wiki Results ===\n`;
      }
    } catch (err) {
      // Wiki search failed — log for debugging, continue with built-in knowledge only
      console.error("Wiki search error:", err.message);
    }
  }

  const client = ModelClient(ENDPOINT, new AzureKeyCredential(token));

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: systemPrompt },
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
    // Content-filter error from the model API (e.g. 400 with content_filter code)
    if (
      String(response.status) === "400" &&
      body?.error?.code === "content_filter"
    ) {
      return FILTERED_REPLY;
    }
    const detail =
      body?.error?.message ||
      (typeof body === "string" ? body : JSON.stringify(body));
    throw new Error(`AI request failed (${response.status}): ${detail}`);
  }

  const choice = response.body.choices[0];

  // finish_reason === "content_filter" means the model generated a reply but
  // the output was blocked by the safety system before being returned.
  if (choice.finish_reason === "content_filter") {
    return FILTERED_REPLY;
  }

  return choice.message.content;
}

module.exports = { chat, FILTERED_REPLY };
