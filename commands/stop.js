const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('kicks bot out of voice channel'),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);
    try {
      queue.destroy();
      await interaction.editReply('Bot is stopped');
    } catch {
      await interaction.editReply("Bot is already stopped");
    }
  }
};