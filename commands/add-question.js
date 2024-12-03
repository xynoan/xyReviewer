const Question = require('../models/Question');
const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'add-question',
    description: 'Adds a question to a subject.',
    async execute(message, args) {
        const subjectName = args[0];
        const questionText = args.slice(1, -1).join(' ');
        const answer = args.slice(-1).join(' ');

        if (!subjectName || !questionText || !answer) {
            const embed = createEmbed({
                title: 'Error',
                description: 'Usage: /add-question <subjectName> <questionText> <answer>',
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

            const newQuestion = new Question({
                userId: message.author.id,
                subjectId: subject._id,
                questionText,
                answer,
            });

            await newQuestion.save();

            const embed = createEmbed({
                title: 'Question Added',
                description: `Question "${questionText}" has been added to subject "${subjectName}".`,
            });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'An error occurred while adding the question.',
                color: 0xff0000,
            });
            message.reply({ embeds: [embed] });
        }
    },
};
