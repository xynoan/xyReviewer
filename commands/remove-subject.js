const Subject = require('../models/Subject');
const Question = require('../models/Question');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'remove-subject',
    description: 'Removes a subject and all associated questions.',
    async execute(message, args) {
        const subjectName = args[0];

        if (!subjectName) {
            const embed = createEmbed({
                title: 'Error',
                description: 'Please provide the subject name.',
                color: 0xff0000,
            });
            return message.reply({ embeds: [embed] });
        }

        try {
            const subject = await Subject.findOneAndDelete({
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

            await Question.deleteMany({ subjectId: subject._id });

            const embed = createEmbed({
                title: 'Subject Removed',
                description: `Subject "${subjectName}" and all associated questions have been removed.`,
            });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'Failed to remove the subject. Please try again later.',
                color: 0xff0000,
            });
            message.reply({ embeds: [embed] });
        }
    },
};
