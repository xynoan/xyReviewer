const Question = require('../models/Question');
const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'review',
    description: 'Lists all questions and answers for a specific subject.',
    async execute(interaction) {
        const subjectId = interaction.options.getString('subject');
        await interaction.deferReply({ ephemeral: true });

        if (!subjectId) {
            const embed = createEmbed({
                title: 'Error',
                description: 'You must provide a subject name.',
                color: 0xff0000,
            });
            return interaction.followUp({ embeds: [embed], ephemeral: true });
        }
        try {
            const subject = await Subject.findOne({
                userId: interaction.user.id,
                _id: subjectId,
            });

            if (!subject) {
                const embed = createEmbed({
                    title: 'Subject Not Found',
                    description: `Subject "${subject.name}" does not exist.`,
                    color: 0xffa500,
                });
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const questions = await Question.find({ subjectId: subject._id });

            if (questions.length === 0) {
                const embed = createEmbed({
                    title: 'No Questions Found',
                    description: `No questions available for subject "${subject.name}".`,
                    color: 0xffa500,
                });
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const embed = createEmbed({
                title: `Questions for "${subject.name}"`,
                description: questions
                    .map(
                        (q, index) =>
                            `${index + 1}. **Question:** ${q.questionText}\n   **Answer:** ${q.answer}`
                    )
                    .join('\n\n'),
                color: 0x0099ff,
            });

            interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'Failed to fetch questions. Please try again later.',
                color: 0xff0000,
            });
            interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    },
};