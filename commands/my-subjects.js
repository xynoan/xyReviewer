const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'my-subjects',
    description: 'Lists all your subjects.',
    async execute(interaction) {
        try {
            const subjects = await Subject.find({ userId: interaction.user.id });

            if (subjects.length === 0) {
                const embed = createEmbed({
                    title: 'No Subjects Found',
                    description: 'You have no subjects. Use `/add-subject` to create one.',
                    color: 0xffa500,
                });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const embed = createEmbed({
                title: 'Your Subjects',
                description: subjects.map((subject, index) => `${index + 1}. ${subject.name}`).join('\n'),
            });

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'Failed to fetch your subjects. Please try again later.',
                color: 0xff0000,
            });
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
