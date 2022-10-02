const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('shows all the commands of the bot'),
  run: async ({ client, interaction }) => {
    let names = [];
    let descriptions = [];
    client.commands.forEach(command => {
        names.push(command.data.name);
        descriptions.push(command.data.description);
    });
    const commandlist = names.map((name, i) => `**${i + 1}. ** ${names[i]} -- \`${descriptions[i]}\``).join('\n');
    const embed = new EmbedBuilder().setTitle(`**Commands: **`).setDescription(commandlist);
    await interaction.editReply({
        embeds: [embed]
    });
  }
};