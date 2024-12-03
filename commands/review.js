const Question = require('../models/Question');
const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'review',
    description: 'Lists all questions for a specific subject.',
    async execute(message, args) {
        const subjectName = args[0];

        if (!subjectName) {
            const embed = createEmbed({
                title: 'Error',
                description: 'Usage: /review <subjectName>',
                color: 0xff0000,
            });
            return message.reply({ embeds: [embed] });
        }

        try {
            const subject = await Subject.findOne({
                userId: message.author.id,
                name: subjectName,
            });

            if (!subject) {
                const embed = createEmbed({
                    title: 'Subject Not Found',
                    description: `Subject "${subjectName}" does not exist.`,
                    color: 0xffa500,
                });
                return message.reply({ embeds: [embed] });
            }

            const questions = await Question.find({ subjectId: subject._id });

            if (questions.length === 0) {
                const embed = createEmbed({
                    title: 'No Questions Found',
                    description: `No questions available for subject "${subjectName}".`,
                    color: 0xffa500,
                });
                return message.reply({ embeds: [embed] });
            }

            const embed = createEmbed({
                title: `Questions for "${subjectName}"`,
                description: questions.map((q, index) => `${index + 1}. ${q.questionText}`).join('\n'),
            });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'Failed to fetch questions. Please try again later.',
                color: 0xff0000,
            });
            message.reply({ embeds: [embed] });
        }
    },
};
