const Question = require('../models/Question');
const Subject = require('../models/Subject');

module.exports = {
    name: 'remove-question',
    description: 'Removes a question from a specific subject.',
    async execute(message, args) {
        const subjectName = args[0];
        const questionText = args.slice(1).join(' ');

        if (!subjectName || !questionText) {
            return message.reply('Usage: /remove-question <subjectName> <questionText>');
        }

        try {
            const subject = await Subject.findOne({
                userId: message.author.id,
                name: subjectName,
            });

            if (!subject) {
                return message.reply(`Subject "${subjectName}" not found.`);
            }

            const question = await Question.findOneAndDelete({
                subjectId: subject._id,
                userId: message.author.id,
                questionText,
            });

            if (!question) {
                return message.reply(`Question "${questionText}" not found in subject "${subjectName}".`);
            }

            message.reply(`Question "${questionText}" has been removed from subject "${subjectName}".`);
        } catch (error) {
            console.error(error);
            message.reply('Failed to remove the question. Please try again.');
        }
    },
};
