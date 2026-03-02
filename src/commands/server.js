const { SlashCommandBuilder } = require("discord.js");
const { SERVER_IP, SERVER_NAME } = require("../knowledge");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("معلومات السيرفر — Server information"),

  async execute(interaction) {
    await interaction.reply(
      `🟢 **${SERVER_NAME} — Minecraft Server**\n` +
      `📡 **IP:** \`${SERVER_IP}\`\n` +
      `🎮 **Java Edition**\n\n` +
      `ادخل السيرفر وابدأ مغامرتك!\n` +
      `Join the server and start your adventure!`
    );
  },
};
