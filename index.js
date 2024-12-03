require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});
const Subject = require('./models/Subject');
const fs = require('fs');

client.commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
        });
    }
});

client.once('ready', () => {
    console.log('Bot is online!');
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// async function createTestSubject(userId) {
//     try {
//         const testSubject = new Subject({
//             userId: userId,
//             name: 'Mathematics',
//         });
//         await testSubject.save();
//         console.log('Test subject saved:', testSubject);
//     } catch (err) {
//         console.error('Error creating test subject:', err);
//     }
// }

// createTestSubject('552020479674941441');

client.login(process.env.DISCORD_TOKEN);