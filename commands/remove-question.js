const Question = require('../models/Question');
const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'remove-question',
    description: 'Removes a question from a subject.',
    async execute(interaction) {
        const subjectName = interaction.options.getString('subject');
        const questionText = interaction.options.getString('question');

        try {
            const subject = await Subject.findOne({
                userId: interaction.user.id,
                name: subjectName,
            });

            if (!subject) {
                const embed = createEmbed({
                    title: 'Subject Not Found',
                    description: `Subject "${subjectName}" does not exist.`,
                    color: 0xffa500,
                });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const question = await Question.findOneAndDelete({
                subjectId: subject._id,
                userId: interaction.user.id,
                questionText,
            });

            if (!question) {
                const embed = createEmbed({
                    title: 'Question Not Found',
                    description: `Question "${questionText}" does not exist in subject "${subjectName}".`,
                    color: 0xffa500,
                });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const embed = createEmbed({
                title: 'Question Removed',
                description: `Question "${questionText}" has been removed from subject "${subjectName}".`,
            });

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'An error occurred while removing the question.',
                color: 0xff0000,
            });
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};