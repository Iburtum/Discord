const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("قائمة الأوامر — List of commands"),

  async execute(interaction) {
    await interaction.reply(
      `📖 **أوامر بوت iburtum — iburtum Bot Commands**\n\n` +
      `\`/setup\` — إعداد قناة المساعد الذكي (مشرفين فقط)\n` +
      `\`/ask\` — اسأل المساعد الذكي عن EliteMobs\n` +
      `\`/server\` — معلومات السيرفر و IP\n` +
      `\`/help\` — عرض هذه القائمة\n\n` +
      `💡 يمكنك أيضاً الكتابة مباشرة في قناة المساعد الذكي وسيرد عليك تلقائياً!\n` +
      `💡 You can also type directly in the AI channel and I'll reply automatically!`
    );
  },
};
