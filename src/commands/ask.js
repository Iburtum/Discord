const { SlashCommandBuilder } = require("discord.js");
const { chat } = require("../ai");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("اسأل المساعد الذكي — Ask the AI assistant")
    .addStringOption((opt) =>
      opt
        .setName("question")
        .setDescription("سؤالك — Your question")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    try {
      const question = interaction.options.getString("question");
      const answer = await chat(question, { userId: interaction.user.id });
      // Discord messages are capped at 2000 characters
      const trimmed = answer.length > 2000 ? answer.slice(0, 1997) + "..." : answer;
      await interaction.editReply(trimmed);
    } catch (err) {
      console.error("AI error:", err);
      await interaction.editReply(
        "❌ حدث خطأ أثناء معالجة سؤالك. حاول مرة أخرى.\n" +
        "❌ An error occurred while processing your question. Please try again."
      );
    }
  },
};
