const Question = require('../models/Question');
const Subject = require('../models/Subject');

module.exports = {
    name: 'remove-subject',
    description: 'Removes a subject and all associated questions.',
    async execute(message, args) {
        const subjectName = args[0];

        if (!subjectName) {
            return message.reply('Usage: /remove-subject <subjectName>');
        }

        try {
            const subject = await Subject.findOneAndDelete({
                userId: message.author.id,
                name: subjectName,
            });

            if (!subject) {
                return message.reply(`Subject "${subjectName}" not found.`);
            }

            await Question.deleteMany({ subjectId: subject._id });

            message.reply(`Subject "${subjectName}" and all associated questions have been removed.`);
        } catch (error) {
            console.error(error);
            message.reply('Failed to remove the subject. Please try again.');
        }
    },
};
