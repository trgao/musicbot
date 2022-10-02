const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('shows the current queue page')
    .addStringOption(option => option.setName('page').setDescription('page number of queue')),
  run: async ({ client, interaction }) => {
    const queue = client.player.getQueue(interaction.guild);
    let embed = new EmbedBuilder();
    if (!queue || !queue.playing) return void interaction.editReply("There are no songs playing");

    const currentSong = queue.current;
    const limit = Math.ceil(queue.tracks.length / 10);
    let pageno = 0;
    if (typeof interaction.options.getString('page') === "string") {
      const n = parseInt(interaction.options.getString('page'));
      if (n >= 1 && n <= limit) {
        pageno = n - 1;
      } else {
        await interaction.editReply("Please enter a valid page number");
      }
    }

    const tracks = queue.tracks.slice(pageno * 10, pageno * 10 + 9).map((song, no) => {return `**${pageno * 10 + no + 1}. ** \`[${song.duration}]\` -- ${song.title}`}).join('\n');
    if (tracks.length === 0) {
      embed.setDescription(`**Currently playing: ** \n \`[${currentSong.duration}]\` -- ${currentSong.title} \n\n\n **Queue: ** \n no songs`).setFooter({text: `Page: ${pageno + 1}`});
    } else {
      embed.setDescription(`**Currently playing: ** \n \`[${currentSong.duration}]\` -- ${currentSong.title} \n\n\n **Queue: ** \n ${tracks}`).setFooter({text: `Page: ${pageno + 1}`});
    }

    await interaction.editReply({
      embeds: [embed]
    });
  }
};