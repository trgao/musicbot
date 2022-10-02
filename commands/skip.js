const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('skips current track'),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);
    try {
        queue.skip();
        if (queue.tracks.length === 1) {
          await interaction.editReply(`There is 1 song left on the queue`);
        } else {
          await interaction.editReply(`There are ${queue.tracks.length} songs left on the queue`);
        }
        
    } catch {
        await interaction.editReply("Please play a song first");
    }
  }
};