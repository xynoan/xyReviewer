const Subject = require('../models/Subject');

module.exports = {
    name: 'my-subjects',
    description: 'Lists all subjects for the user.',
    async execute(message, args) {
        try {
            const subjects = await Subject.find({ userId: message.author.id });
            if (subjects.length === 0) {
                return message.reply('You have no subjects.');
            }

            const subjectList = subjects.map(subject => `- ${subject.name}`).join('\n');
            message.reply(`Your subjects:\n${subjectList}`);
        } catch (error) {
            console.error(error);
            message.reply('Failed to fetch your subjects.');
        }
    },
};
