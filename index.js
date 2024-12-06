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
    if (interaction.isCommand()) {
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
    } else if (interaction.isAutocomplete()) {
        const { commandName } = interaction;

        if (commandName === 'add-question' ||
            commandName === 'remove-question' ||
            commandName === 'start-quiz' ||
            commandName === 'review' ||
            commandName === 'remove-subject'
        ) {
            const userId = interaction.user.id;

            try {
                const subjects = await Subject.find({ userId }).sort({ createdAt: -1 }).exec();

                const choices = subjects.map((subject) => ({
                    name: subject.name,
                    value: subject.name,
                }));

                await interaction.respond(choices.slice(0, 25));
            } catch (error) {
                console.error('Error fetching subjects for autocomplete:', error);
                await interaction.respond([{ name: 'Error fetching subjects', value: 'error' }]);
            }
        }
    }
});

client.once('ready', () => {
    console.log('Bot is online!');
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

client.login(process.env.DISCORD_TOKEN);