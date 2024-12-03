const { ongoingQuizzes } = require('../quizState');
const Question = require('../models/Question');
const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'start-quiz',
    description: 'Starts a quiz for a subject.',
    async execute(message, args) {
        const subjectName = args[0];

        if (!subjectName) {
            const embed = createEmbed({
                title: 'Error',
                description: 'Usage: /start-quiz <subjectName>',
                color: 0xff0000,
            });
            return message.reply({ embeds: [embed] });
        }

        if (ongoingQuizzes[message.author.id]) {
            const embed = createEmbed({
                title: 'Quiz Already Running',
                description: 'You already have a quiz in progress. Use /stop-quiz to end it.',
                color: 0xffa500,
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

            const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

            ongoingQuizzes[message.author.id] = {
                subjectName,
                questions: shuffledQuestions,
                currentQuestion: 0,
                correctAnswers: 0,
                wrongAnswers: [],
            };

            const embed = createEmbed({
                title: 'Quiz Started',
                description: `Starting quiz for "${subjectName}".\n\nFirst question:\n${shuffledQuestions[0].questionText}`,
            });

            message.reply({ embeds: [embed] });

            const filter = (response) => response.author.id === message.author.id;
            const collector = message.channel.createMessageCollector({ filter });

            collector.on('collect', (response) => {
                const quiz = ongoingQuizzes[message.author.id];

                if (!quiz) {
                    collector.stop();
                    return;
                }

                const currentQuestion = quiz.questions[quiz.currentQuestion];

                if (response.content.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
                    quiz.correctAnswers += 1;
                    response.reply('Correct!');
                } else {
                    quiz.wrongAnswers.push({
                        question: currentQuestion.questionText,
                        correctAnswer: currentQuestion.answer,
                    });
                    response.reply(`Wrong! The correct answer was: ${currentQuestion.answer}`);
                }

                quiz.currentQuestion += 1;

                if (quiz.currentQuestion >= quiz.questions.length) {
                    const summaryEmbed = createEmbed({
                        title: 'Quiz Completed',
                        description: `Quiz completed! You got ${quiz.correctAnswers} out of ${quiz.questions.length} correct.`,
                        color: 0x0099ff,
                    });

                    if (quiz.wrongAnswers.length > 0) {
                        summaryEmbed.addFields({
                            name: 'Wrong Answers',
                            value: quiz.wrongAnswers
                                .map((item) => `${item.question} (Correct: ${item.correctAnswer})`)
                                .join('\n'),
                        });
                    }

                    response.reply({ embeds: [summaryEmbed] });
                    delete ongoingQuizzes[message.author.id];
                    collector.stop();
                } else {
                    response.channel.send(`Next question:\n${quiz.questions[quiz.currentQuestion].questionText}`);
                }
            });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'Failed to start the quiz. Please try again later.',
                color: 0xff0000,
            });
            message.reply({ embeds: [embed] });
        }
    },
};
