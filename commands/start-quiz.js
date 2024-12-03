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
                wrongAnswers: [],
            };

            message.reply(
                `Starting quiz for "${subjectName}". First question:\n${shuffledQuestions[0].questionText}`
            );

            const filter = (response) => response.author.id === message.author.id;
            const collector = message.channel.createMessageCollector({ filter });

            collector.on('collect', (response) => {
                const quiz = ongoingQuizzes[message.author.id];
                if (!quiz) {
                    collector.stop(); 
                    return;
                }

                const currentQuestion = quiz.questions[quiz.currentQuestion];
                if (
                    response.content.toLowerCase() === currentQuestion.answer.toLowerCase()
                ) {
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
                    let summary = `**Quiz Summary**:\n` +
                        `Total Questions: ${quiz.questions.length}\n` +
                        `Correct Answers: ${quiz.correctAnswers}\n` +
                        `Incorrect Answers: ${quiz.questions.length - quiz.correctAnswers}\n\n`;

                    if (quiz.wrongAnswers.length > 0) {
                        summary += '**Questions You Got Wrong:**\n';
                        quiz.wrongAnswers.forEach((item, index) => {
                            summary += `${index + 1}. ${item.question} (Answer: ${item.correctAnswer})\n`;
                        });
                    }

                    response.reply(summary);
                    delete ongoingQuizzes[message.author.id];
                    collector.stop(); 
                } else {
                    response.channel.send(
                        `Next question:\n${quiz.questions[quiz.currentQuestion].questionText}`
                    );
                }
            });
        } catch (error) {
            console.error(error);
            message.reply('Failed to start the quiz. Please try again later.');
        }
    },
};
