const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('shuffles songs in the queue'),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);
    try {
        queue.shuffle();
        await interaction.editReply('Queue is shuffled');
    } catch {
        await interaction.editReply("Queue is empty");
    }
  }
};