const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('clears all the songs in the queue'),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);
    try {
        queue.clear();
        await interaction.editReply('Queue is cleared');
    } catch {
        await interaction.editReply("No songs are in the queue");
    }
  }
};