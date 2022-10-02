const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skipto')
    .setDescription('skips to the track with the specified number')
    .addStringOption(option => option.setName('trackno').setDescription('number of track you are skipping to').setRequired(true)),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);
    try {
        if (typeof interaction.options.getString('trackno') === "string") {
          const trackno = parseInt(interaction.options.getString('trackno')) - 1;
          if (trackno < 0 || trackno >= queue.tracks.length) {
            await interaction.editReply("Please enter a valid track number");
          } else {
            queue.skipTo(trackno);
            if (queue.tracks.length === 1) {
          await interaction.editReply(`There is 1 song left on the queue`);
        } else {
          await interaction.editReply(`There are ${queue.tracks.length} songs left on the queue`);
        }
          }
        } else if (queue.tracks.length === 0) {
            await interaction.editReply("No songs in queue to skip to");
        }
    } catch {
        await interaction.editReply("Please play a song first");
    }
  }
};