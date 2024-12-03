const Question = require('../models/Question');
const Subject = require('../models/Subject');

module.exports = {
    name: 'add-question',
    description: 'Adds a question to a specific subject.',
    async execute(message, args) {
        const subjectName = args[0];
        const questionText = args.slice(1, -1).join(' ');
        const answer = args.slice(-1).join(' ');

        if (!subjectName || !questionText || !answer) {
            return message.reply('Usage: /add-question <subjectName> <questionText> <answer>');
        }

        try {
            const subject = await Subject.findOne({
                userId: message.author.id,
                name: subjectName,
            });

            if (!subject) {
                return message.reply(`Subject "${subjectName}" not found.`);
            }

            const newQuestion = new Question({
                userId: message.author.id,
                subjectId: subject._id,
                questionText,
                answer,
            });

            await newQuestion.save();
            message.reply(`Question added to subject "${subjectName}": "${questionText}"`);
        } catch (error) {
            console.error(error);
            message.reply('Failed to add the question.');
        }
    },
};