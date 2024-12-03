const Question = require('../models/Question');
const Subject = require('../models/Subject');

module.exports = {
    name: 'review',
    description: 'Lists all questions for a specific subject.',
    async execute(message, args) {
        const subjectName = args[0];

        if (!subjectName) {
            return message.reply('Usage: /review <subjectName>');
        }

        try {
            const subject = await Subject.findOne({
                userId: message.author.id,
                name: subjectName,
            });

            if (!subject) {
                return message.reply(`Subject "${subjectName}" not found.`);
            }

            const questions = await Question.find({ subjectId: subject._id });

            if (questions.length === 0) {
                return message.reply(`No questions found for subject "${subjectName}".`);
            }

            const questionList = questions
                .map((q, i) => `${i + 1}. ${q.questionText} - Answer: ${q.answer}`)
                .join('\n');
            message.reply(`Questions for "${subjectName}":\n${questionList}`);
        } catch (error) {
            console.error(error);
            message.reply('Failed to retrieve questions.');
        }
    },
};
