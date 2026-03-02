const { SlashCommandBuilder } = require("discord.js");
const { searchWiki, WIKI_BASE } = require("../search");

// Discord's message cap is 2000 chars; leave room for the header lines
const RESULT_TRIM_LENGTH = 1750;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wiki")
    .setDescription("ابحث في ويكي EliteMobs — Search the EliteMobs wiki")
    .addStringOption((opt) =>
      opt
        .setName("query")
        .setDescription("ما تبحث عنه — What to search for")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const query = interaction.options.getString("query");
    const searchUrl = `${WIKI_BASE}/search?q=${encodeURIComponent(query)}`;

    try {
      const result = await searchWiki(query);

      if (!result) {
        await interaction.editReply(
          `🔍 لم يتم العثور على نتائج لـ: **${query}**\n` +
          `🔍 No results found for: **${query}**\n` +
          `📖 <${searchUrl}>`
        );
        return;
      }

      const trimmed =
        result.length > RESULT_TRIM_LENGTH
          ? result.slice(0, RESULT_TRIM_LENGTH) + "..."
          : result;

      await interaction.editReply(
        `📖 **نتائج ويكي EliteMobs / Wiki Results for:** \`${query}\`\n` +
        `🔗 <${searchUrl}>\n\n` +
        trimmed
      );
    } catch (err) {
      console.error("Wiki search error:", err);
      await interaction.editReply(
        `❌ فشل البحث في الويكي، جرب لاحقاً.\n` +
        `❌ Wiki search failed, please try again later.\n` +
        `📖 <${WIKI_BASE}>`
      );
    }
  },
};
