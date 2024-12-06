const Question = require('../models/Question');
const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'remove-question',
    description: 'Removes a question from a subject.',
    async execute(interaction) {
        const subjectId = interaction.options.getString('subject'); 
        const questionId = interaction.options.getString('question'); 

        await interaction.deferReply({ ephemeral: true });

        try {
            const subject = await Subject.findOne({
                userId: interaction.user.id,
                _id: subjectId,
            });

            if (!subject) {
                const embed = createEmbed({
                    title: 'Subject Not Found',
                    description: `The subject you selected does not exist.`,
                    color: 0xffa500,
                });
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const question = await Question.findOneAndDelete({
                _id: questionId, 
                userId: interaction.user.id, 
                subjectId: subject._id, 
            });

            if (!question) {
                const embed = createEmbed({
                    title: 'Question Not Found',
                    description: `The question with ID "${questionId}" does not exist in the subject "${subject.name}".`,
                    color: 0xffa500,
                });
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const embed = createEmbed({
                title: 'Question Removed',
                description: `The question "${question.questionText}" has been successfully removed from the subject "${subject.name}".`,
                color: 0x00ff00,
            });

            interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error('Error removing question:', error);

            const embed = createEmbed({
                title: 'Error',
                description: 'An unexpected error occurred while trying to remove the question. Please try again later.',
                color: 0xff0000,
            });

            interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    },
};