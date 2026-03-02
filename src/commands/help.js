const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("قائمة الأوامر — List of commands"),

  async execute(interaction) {
    await interaction.reply(
      `## 🤖 iburtum — المساعد الذكي لـ Ramadan Craft\n\n` +
      `**الأوامر المتاحة — Available Commands**\n\n` +
      `⚙️ \`/setup\` — إعداد قناة المساعد الذكي *(مشرفين فقط / Admins only)*\n` +
      `🧠 \`/ask\` — اسأل المساعد الذكي أي سؤال\n` +
      `🌐 \`/server\` — معلومات السيرفر والـ IP\n` +
      `📖 \`/help\` — عرض هذه القائمة\n` +
      `🗺️ \`/wiki\` — ابحث في ويكي السيرفر\n\n` +
      `---\n` +
      `💡 **نصيحة:** يمكنك الكتابة مباشرة في قناة المساعد الذكي وسيرد عليك تلقائياً!\n` +
      `💡 **Tip:** You can also type directly in the AI channel and I'll reply automatically!\n\n` +
      `🌟 *iburtum — powered by GPT-4.1*`
    );
  },
};
