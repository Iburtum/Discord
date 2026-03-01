const fs = require("node:fs");
const path = require("node:path");

const CONFIG_PATH = path.join(__dirname, "..", "config.json");

/** Default configuration. */
const DEFAULT_CONFIG = {
  // guildId -> channelId mapping for AI channels
  aiChannels: {},
};

/** In-memory cache so we only read disk once at startup. */
let cache = null;

/**
 * Load the config from disk (or return defaults). Uses an in-memory cache.
 * @returns {object}
 */
function load() {
  if (cache) return cache;
  try {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    cache = { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch {
    cache = { ...DEFAULT_CONFIG };
  }
  return cache;
}

/**
 * Persist the config to disk.
 * @param {object} cfg
 */
function save(cfg) {
  cache = cfg;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

/**
 * Set the AI channel for a guild.
 * @param {string} guildId
 * @param {string} channelId
 */
function setAiChannel(guildId, channelId) {
  const cfg = load();
  cfg.aiChannels[guildId] = channelId;
  save(cfg);
}

/**
 * Get the AI channel for a guild (or null).
 * @param {string} guildId
 * @returns {string|null}
 */
function getAiChannel(guildId) {
  const cfg = load();
  return cfg.aiChannels[guildId] || null;
}

module.exports = { load, save, setAiChannel, getAiChannel };
