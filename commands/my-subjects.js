const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'my-subjects',
    description: 'Lists all subjects for the user.',
    async execute(message) {
        try {
            const subjects = await Subject.find({ userId: message.author.id });

            if (subjects.length === 0) {
                const embed = createEmbed({
                    title: 'No Subjects Found',
                    description: 'You have no subjects. Use `/add-subject` to create one.',
                    color: 0xffa500,
                });
                return message.reply({ embeds: [embed] });
            }

            const embed = createEmbed({
                title: 'Your Subjects',
                description: subjects.map((subject, index) => `${index + 1}. ${subject.name}`).join('\n'),
            });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'Failed to fetch your subjects. Please try again later.',
                color: 0xff0000,
            });
            message.reply({ embeds: [embed] });
        }
    },
};