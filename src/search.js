/**
 * Wiki search helper — fetches and parses content from the EliteMobs wiki.
 * Uses Node's built-in https module (no extra dependencies).
 */
const https = require("node:https");
const http = require("node:http");

const WIKI_BASE = "https://wiki.nightbreak.io";
const SEARCH_TIMEOUT_MS = 6000;
const MAX_CONTENT_CHARS = 1500;

/**
 * Fetch a URL, following up to `redirectsLeft` redirects, with a timeout.
 * @param {string} url
 * @param {number} [redirectsLeft=3]
 * @returns {Promise<string>} Raw response body
 */
function fetchUrl(url, redirectsLeft = 3) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(
      url,
      { headers: { "User-Agent": "iburtum-Discord-Bot/1.0" } },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location &&
          redirectsLeft > 0
        ) {
          const next = res.headers.location.startsWith("http")
            ? res.headers.location
            : `${WIKI_BASE}${res.headers.location}`;
          res.resume();
          return fetchUrl(next, redirectsLeft - 1).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
        }
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );
    req.setTimeout(SEARCH_TIMEOUT_MS, () => {
      req.destroy();
      reject(new Error("Wiki request timed out"));
    });
    req.on("error", reject);
  });
}

/**
 * Strip HTML tags and decode common HTML entities, returning plain text.
 * All tags (including script/style) are removed by a single generic pass,
 * which avoids regex-evasion edge cases from selective tag removal.
 * The output is used only as plain text (Discord messages / AI prompt),
 * so there is no HTML-injection risk.
 * @param {string} html
 * @returns {string}
 */
function stripHtml(html) {
  // Remove all HTML tags generically
  let text = html.replace(/<[^>]*>/g, " ");
  // Decode common HTML entities in a single pass (avoids double-decoding)
  const ENTITIES = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&nbsp;": " ",
  };
  text = text.replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m] ?? " ");
  return text.replace(/\s{2,}/g, " ").trim();
}

/**
 * Search the EliteMobs wiki for a query and return up to MAX_CONTENT_CHARS
 * characters of extracted plain text.
 * Returns an empty string if the search fails or yields no useful content.
 * @param {string} query
 * @returns {Promise<string>}
 */
async function searchWiki(query) {
  const url = `${WIKI_BASE}/search?q=${encodeURIComponent(query)}`;
  let html;
  try {
    html = await fetchUrl(url);
  } catch {
    // Network/timeout/HTTP error — return empty string so callers can proceed
    return "";
  }
  const text = stripHtml(html);
  // Only return content if it's substantive (not just a blank/error page)
  return text.length > 100 ? text.slice(0, MAX_CONTENT_CHARS) : "";
}

module.exports = { searchWiki, fetchUrl, stripHtml, WIKI_BASE };
