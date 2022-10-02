const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('pauses music'),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);
    try {
      const test = await queue.setPaused();
        if (test) {
          await interaction.editReply("Song is already paused");
        } else {
          queue.setPaused(true);
          await interaction.editReply("Song is now paused");
        }
    } catch {
        await interaction.editReply("Please play a song first");
    }
  }
};