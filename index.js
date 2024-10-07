require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const setupCommands = require('./commands/setupCommands');
const setupEventHandlers = require('./events/setupEventHandlers');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

setupCommands(client);
setupEventHandlers(client);

client.login(process.env.BOT_TOKEN);

module.exports = client;