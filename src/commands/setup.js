const { SlashCommandBuilder, ChannelType, PermissionFlagsBits, MessageFlags } = require("discord.js");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("إعداد البوت — Setup the bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addChannelOption((opt) =>
      opt
        .setName("channel")
        .setDescription("القناة النصية للمساعد الذكي — Text channel for the AI assistant")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    const channel = interaction.options.getChannel("channel");
    config.setAiChannel(interaction.guildId, channel.id);

    await interaction.reply({
      content:
        `✅ تم تعيين قناة المساعد الذكي إلى ${channel}\n` +
        `✅ AI assistant channel set to ${channel}`,
      flags: MessageFlags.Ephemeral,
    });
  },
};
