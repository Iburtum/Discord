// Polyfill globalThis.crypto for Node.js versions where it is not a global.
// @typespec/ts-http-runtime (used by @azure-rest/ai-inference) requires it.
if (!globalThis.crypto) {
  const nodeCrypto = require("node:crypto");
  globalThis.crypto = nodeCrypto.webcrypto ?? nodeCrypto;
}

require("dotenv").config();

const { Client, Collection, Events, GatewayIntentBits, MessageFlags } = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const config = require("./config");
const { chat } = require("./ai");

// ── Create client ───────────────────────────────────────────────
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// ── Load slash commands ─────────────────────────────────────────
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.data.name, command);
}

// ── Slash command handler ───────────────────────────────────────
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(`Error executing /${interaction.commandName}:`, err);
    const reply = {
      content:
        "❌ حدث خطأ أثناء تنفيذ الأمر.\n❌ An error occurred while executing this command.",
      flags: MessageFlags.Ephemeral,
    };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

// ── Auto-reply in the configured AI channel ─────────────────────
client.on(Events.MessageCreate, async (message) => {
  // Ignore bots and DMs
  if (message.author.bot || !message.guild) return;

  const aiChannelId = config.getAiChannel(message.guild.id);
  if (!aiChannelId || message.channel.id !== aiChannelId) return;

  // Show typing indicator while generating a response
  await message.channel.sendTyping();

  try {
    const answer = await chat(message.content);
    // Discord messages are capped at 2000 characters
    const trimmed = answer.length > 2000 ? answer.slice(0, 1997) + "..." : answer;
    await message.reply(trimmed);
  } catch (err) {
    console.error("AI channel error:", err);
    await message.reply(
      "❌ حدث خطأ أثناء معالجة رسالتك. حاول مرة أخرى.\n" +
      "❌ An error occurred while processing your message. Please try again."
    );
  }
});

// ── Ready ───────────────────────────────────────────────────────
client.once(Events.ClientReady, (c) => {
  console.log(`✅ Logged in as ${c.user.tag}`);
});

// ── Login ───────────────────────────────────────────────────────
client.login(process.env.DISCORD_TOKEN);
