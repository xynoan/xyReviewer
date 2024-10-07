const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const loadSubjects = require('../utils/loadSubjects');

function getCommands() {
    const subjects = loadSubjects();
    return [
        new SlashCommandBuilder()
            .setName('quiz')
            .setDescription('Start a new quiz')
            .addStringOption(option =>
                option.setName('subject')
                    .setDescription('Choose the subject for the quiz')
                    .setRequired(true)
                    .addChoices(...Object.keys(subjects).map(subject => ({ name: subject, value: subject })))
            ),
        new SlashCommandBuilder()
            .setName('review')
            .setDescription('Review questions and answers before starting a quiz')
            .addStringOption(option =>
                option.setName('subject')
                    .setDescription('Choose the subject to review')
                    .setRequired(true)
                    .addChoices(...Object.keys(subjects).map(subject => ({ name: subject, value: subject })))
            ),
        new SlashCommandBuilder()
            .setName('add')
            .setDescription('Add a question to a subject (Admin only)')
            .addStringOption(option =>
                option.setName('subject')
                    .setDescription('Choose the subject to add a question to')
                    .setRequired(true)
                    .addChoices(...Object.keys(subjects).map(subject => ({ name: subject, value: subject })))
            )
            .addStringOption(option =>
                option.setName('type')
                    .setDescription('Type of question')
                    .setRequired(true)
                    .addChoices(
                        { name: 'Multiple Choice', value: 'multiple-choice' },
                        { name: 'Enumeration', value: 'enumeration' }
                    )
            )
            .addStringOption(option =>
                option.setName('question')
                    .setDescription('The question text')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('answer')
                    .setDescription('The correct answer(s), comma-separated for enumeration')
                    .setRequired(true)
            )
            .addStringOption(option =>
                option.setName('options')
                    .setDescription('Options for multiple choice, comma-separated')
                    .setRequired(false)
            ),
        new SlashCommandBuilder()
            .setName('remove')
            .setDescription('Remove a question from a subject')
            .addStringOption(option =>
                option.setName('subject')
                    .setDescription('Choose the subject to remove a question from')
                    .setRequired(true)
                    .addChoices(...Object.keys(subjects).map(subject => ({ name: subject, value: subject })))
            )
            .addIntegerOption(option =>
                option.setName('index')
                    .setDescription('The index of the question to remove (starting from 1)')
                    .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('reload-subjects')
            .setDescription('Reload all subjects (Admin only)'),
        new SlashCommandBuilder()
            .setName('stop-quiz')
            .setDescription('Stop the currently running quiz'),
    ];
}

async function registerCommands(client) {
    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: getCommands() },
        );
        console.log('Successfully registered application commands.');
    } catch (error) {
        console.error(error);
    }
}

module.exports = function setupCommands(client) {
    client.once('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        registerCommands(client);
    });
    return registerCommands; 
};