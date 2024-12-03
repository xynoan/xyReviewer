const { ongoingQuizzes } = require('../quizState');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'stop-quiz',
    description: 'Stops the current quiz.',
    async execute(message) {
        const quiz = ongoingQuizzes[message.author.id];

        if (!quiz) {
            const embed = createEmbed({
                title: 'No Quiz in Progress',
                description: 'You are not currently taking a quiz.',
                color: 0xffa500,
            });
            return message.reply({ embeds: [embed] });
        }

        delete ongoingQuizzes[message.author.id];

        const embed = createEmbed({
            title: 'Quiz Stopped',
            description: `Your quiz for "${quiz.subjectName}" has been stopped.`,
        });

        message.reply({ embeds: [embed] });
    },
};
