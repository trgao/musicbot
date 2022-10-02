const { SlashCommandBuilder } = require('@discordjs/builders');
const { createQueue, QueryType } = require('discord-player');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('plays a song, playlist from a link or search using keywords')
    .addSubcommand(subcommand =>
      subcommand
        .setName('song')
        .setDescription('plays a song through searching with keywords')
        .addStringOption(option => option.setName('keywords').setDescription('name of song').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('link')
        .setDescription('plays a song from a link')
        .addStringOption(option => option.setName('url').setDescription('link of song').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('playlist')
        .setDescription('plays playlist from a link')
        .addStringOption(option => option.setName('listurl').setDescription('link of playlist').setRequired(true))
    ),
  run: async ({ client, interaction }) => {
    if (!interaction.member.voice.channel) return interaction.editReply("You need to be in a voice channel to use this command");

    const queue = client.player.createQueue(interaction.guild, {
      metadata: {
        channel: interaction.channel
      }
    });

    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch {
      queue.destroy();
      return await interaction.editReply({ content: "Could not join your voice channel", ephemeral: true });
    }

    let embed = new EmbedBuilder();

    if (interaction.options.getSubcommand() === 'song') {
      const query = interaction.options.getString('keywords');

      const track = await client.player.search(query, {
        requestedBy: interaction.user
      }).then(x => x.tracks[0]);
      if (!track) return void interaction.editReply({ content: `❌ | Track **${query}** not found` });

      await queue.addTrack(track);

      embed
        .setDescription(`**[${track.title}](${track.url})** has been added to the queue`)
        .setThumbnail(track.thumbnail)
        .setFooter({ text: `Duration: ${track.duration}` })
    } else if (interaction.options.getSubcommand() === 'link') {
      const url = interaction.options.getString('url');

      const track = await client.player.search(url, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_VIDEO
      }).then(x => x.tracks[0]);
      if (!track) return void interaction.editReply({ content: `❌ | **${url}** is not a valid link` });

      await queue.addTrack(track);

      embed
        .setDescription(`**[${track.title}](${track.url})** has been added to the queue`)
        .setThumbnail(track.thumbnail)
        .setFooter({ text: `Duration: ${track.duration}` })
    } else if (interaction.options.getSubcommand() === 'playlist') {
      const listurl = interaction.options.getString('listurl');

      const result = await client.player.search(listurl, {
        requestedBy: interaction.user,
        searchEngine: QueryType.YOUTUBE_PLAYLIST
      });
      if (!result.tracks.length) return void interaction.editReply({ content: `❌ | **${listurl}** is not a valid link` });
      
      const tracks = result.tracks;
      const playlist = result.playlist;
      await queue.addTracks(tracks);

      if (tracks.length > 1) {
        embed.setDescription(`${tracks.length} songs from [${playlist.title}](${playlist.url}) have been added to the queue`)
      } else {
        embed.setDescription(`1 song from [${playlist.title}](${playlist.url}) has been added to the queue`)
      }
    }
    await interaction.editReply({
      embeds: [embed]
    })
    if (!queue.playing) await queue.play();
  }
};