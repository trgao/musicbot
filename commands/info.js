const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('information of current song playing'),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);
    let embed = new EmbedBuilder();
    try {
        const song = queue.nowPlaying();
        const bar = queue.createProgressBar();
        embed
            .setTitle(`${song.title}`)
            .setURL(`${song.url}`)
            .setDescription(`${bar}`)
            .setThumbnail(`${song.thumbnail}`)
        await interaction.editReply({
            embeds: [embed]
        });
      } catch {
        await interaction.editReply("Please play a song first");
      }
  }
};