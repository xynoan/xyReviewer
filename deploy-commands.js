const { REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
    {
        name: 'add-subject',
        description: 'Add a new subject',
        options: [
            {
                name: 'name',
                type: 3,
                description: 'The name of the subject',
                required: true,
            },
        ],
    },
    {
        name: 'remove-subject',
        description: 'Remove a subject and all associated questions',
        options: [
            {
                name: 'name',
                type: 3,
                description: 'The name of the subject',
                required: true,
            },
        ],
    },
    {
        name: 'add-question',
        description: 'Add a question to a subject',
        options: [
            {
                name: 'subject',
                type: 3,
                description: 'The subject name',
                required: true,
            },
            {
                name: 'question',
                type: 3,
                description: 'The question text',
                required: true,
            },
            {
                name: 'answer',
                type: 3,
                description: 'The correct answer',
                required: true,
            },
        ],
    },
    {
        name: 'remove-question',
        description: 'Remove a question from a subject',
        options: [
            {
                name: 'subject',
                type: 3,
                description: 'The subject name',
                required: true,
            },
            {
                name: 'question',
                type: 3,
                description: 'The question text',
                required: true,
            },
        ],
    },
    {
        name: 'my-subjects',
        description: 'Lists all your subjects',
    },
    {
        name: 'review',
        description: 'Review all questions for a subject',
        options: [
            {
                name: 'subject',
                type: 3,
                description: 'The subject name',
                required: true,
            },
        ],
    },
    {
        name: 'start-quiz',
        description: 'Start a quiz for a subject',
        options: [
            {
                name: 'subject',
                type: 3,
                description: 'The subject name',
                required: true,
            },
        ],
    },
    {
        name: 'stop-quiz',
        description: 'Stop the currently running quiz',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );
        console.log('Slash commands registered successfully.');
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
})();
