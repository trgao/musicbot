const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('just for testing the bot'),
  run: async ({ client, interaction }) => {
    await interaction.editReply('testing 123');
  }
};