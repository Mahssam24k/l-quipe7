const { Client, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
client.userWarnings = new Collection();
client.userActivity = new Collection();
client.voiceTime = new Collection();

require('./handlers/commandHandler')(client);
require('./handlers/eventHandler')(client);

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('Uncaught exception:', error);
});

client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error('Failed to login:', err);
  process.exit(1);
});