const { SlashCommandBuilder } = require("discord.js");
const { SERVER_IP } = require("../knowledge");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("معلومات السيرفر — Server information"),

  async execute(interaction) {
    await interaction.reply(
      `🟢 **سيرفر ماينكرافت — Minecraft Server**\n` +
      `📡 **IP:** \`${SERVER_IP}\`\n` +
      `🎮 **Java Edition**\n\n` +
      `ادخل السيرفر وابدأ مغامرتك!\n` +
      `Join the server and start your adventure!`
    );
  },
};
