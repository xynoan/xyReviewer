const { ongoingQuizzes } = require('../quizState');

module.exports = {
    name: 'submit-answer',
    description: 'Submit an answer for the current quiz question.',
    async execute(message, args) {
        const answer = args.join(' ');
        const quiz = ongoingQuizzes[message.author.id];

        if (!quiz) {
            return message.reply('You are not currently taking a quiz.');
        }

        const currentQuestion = quiz.questions[quiz.currentQuestion];
        if (answer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
            quiz.correctAnswers += 1;
            message.reply('Correct!');
        } else {
            message.reply(`Wrong! The correct answer was: ${currentQuestion.answer}`);
        }

        quiz.currentQuestion += 1;

        if (quiz.currentQuestion >= quiz.questions.length) {
            message.reply(
                `Quiz finished! You got ${quiz.correctAnswers} out of ${quiz.questions.length} correct.`
            );
            delete ongoingQuizzes[message.author.id]; 
        } else {
            message.channel.send(
                `Next question:\n${quiz.questions[quiz.currentQuestion].questionText}`
            );
        }
    },
};
