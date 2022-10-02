const DiscordJS = require('discord.js');
const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const { Player } = require('discord-player');
dotenv.config();
require('http').createServer((req, res) => res.end('Bot is alive!')).listen(3000);

const client = new DiscordJS.Client({
  intents: [
    DiscordJS.GatewayIntentBits.Guilds,
    DiscordJS.GatewayIntentBits.GuildMessages,
    DiscordJS.GatewayIntentBits.MessageContent,
    DiscordJS.GatewayIntentBits.GuildVoiceStates
  ]
});

const commands = [];

client.commands = new DiscordJS.Collection();
const commandFiles = fs.readdirSync(`./commands/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
  client.commands.set(command.data.name, command);
}

client.once('ready', () => {
  console.log('bot is ready')

  const clientId = client.user.id;
  const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

  (async () => {
    try {
      const data = await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands },
      );

      console.log('Successfully reloaded slash commands.');
    } catch (error) {
      console.error(error);
    }
  })();
});

client.player = new Player(client, {
  ytdlOptions: {
    quality: "highestaudio",
    highWaterMark: 1 << 25
  }
});

client.on('interactionCreate', async interaction => {
  if (interaction.user.bot || !interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;
  await interaction.deferReply();
  await command.run({ client, interaction });
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

client.login(process.env.TOKEN);
