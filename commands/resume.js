const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('resumes music'),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);
    try {
      const test = await queue.setPaused();
        if (test) {
          queue.setPaused(false);
          await interaction.editReply("Song is now resumed");
        } else {
          await interaction.editReply("Song is already playing");
        }
    } catch {
        await interaction.editReply("Please play a song first");
    }
  }
};