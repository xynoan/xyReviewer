const { ongoingQuizzes } = require('../quizState');

module.exports = {
    name: 'stop-quiz',
    description: 'Stops the current quiz.',
    async execute(message, args) {
        if (!ongoingQuizzes[message.author.id]) {
            return message.reply('You are not currently taking a quiz.');
        }

        delete ongoingQuizzes[message.author.id]; 
        message.reply('Your quiz has been stopped. You can start a new one anytime.');
    },
};
