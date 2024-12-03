const { ongoingQuizzes } = require('../quizState');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'stop-quiz',
    description: 'Stops the current quiz.',
    async execute(interaction) {
        const quiz = ongoingQuizzes[interaction.user.id];

        if (!quiz) {
            const embed = createEmbed({
                title: 'No Quiz in Progress',
                description: 'You are not currently taking a quiz.',
                color: 0xffa500,
            });
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        delete ongoingQuizzes[interaction.user.id];

        const embed = createEmbed({
            title: 'Quiz Stopped',
            description: `Your quiz for "${quiz.subjectName}" has been stopped.`,
            color: 0x0099ff,
        });

        interaction.reply({ embeds: [embed] });
    },
};
