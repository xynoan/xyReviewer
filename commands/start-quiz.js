const { ongoingQuizzes } = require('../quizState');
const Question = require('../models/Question');
const Subject = require('../models/Subject');

module.exports = {
    name: 'start-quiz',
    description: 'Starts a quiz for a specific subject.',
    async execute(message, args) {
        const subjectName = args[0];
        if (!subjectName) {
            return message.reply('Usage: /start-quiz <subjectName>');
        }

        if (ongoingQuizzes[message.author.id]) {
            return message.reply('You already have a quiz in progress. Use /stop-quiz to end it.');
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
                return message.reply(`No questions available for subject "${subjectName}".`);
            }

            const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
            ongoingQuizzes[message.author.id] = {
                subjectName,
                questions: shuffledQuestions,
                currentQuestion: 0,
                correctAnswers: 0,
            };

            message.reply(
                `Starting quiz for "${subjectName}". First question:\n${shuffledQuestions[0].questionText}`
            );
        } catch (error) {
            console.error(error);
            message.reply('Failed to start the quiz.');
        }
    },
};
