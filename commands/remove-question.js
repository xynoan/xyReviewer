const Question = require('../models/Question');
const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'remove-question',
    description: 'Removes a question from a subject.',
    async execute(message, args) {
        const subjectName = args[0];
        const questionText = args.slice(1).join(' ');

        if (!subjectName || !questionText) {
            const embed = createEmbed({
                title: 'Error',
                description: 'Usage: /remove-question <subjectName> <questionText>',
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

            const question = await Question.findOneAndDelete({
                subjectId: subject._id,
                userId: message.author.id,
                questionText,
            });

            if (!question) {
                const embed = createEmbed({
                    title: 'Question Not Found',
                    description: `Question "${questionText}" does not exist in subject "${subjectName}".`,
                    color: 0xffa500,
                });
                return message.reply({ embeds: [embed] });
            }

            const embed = createEmbed({
                title: 'Question Removed',
                description: `Question "${questionText}" has been removed from subject "${subjectName}".`,
            });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'An error occurred while removing the question.',
                color: 0xff0000,
            });
            message.reply({ embeds: [embed] });
        }
    },
};
