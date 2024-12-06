const Question = require('../models/Question');
const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'add-question',
    description: 'Adds a question to a subject.',
    async execute(interaction) {
        const subjectId = interaction.options.getString('subject'); 
        const questionText = interaction.options.getString('question');
        const answer = interaction.options.getString('answer');
        await interaction.deferReply({ ephemeral: true });
        try {
            const subject = await Subject.findOne({
                userId: interaction.user.id,
                _id: subjectId,
            });

            if (!subject) {
                const embed = createEmbed({
                    title: 'Subject Not Found',
                    description: `The selected subject does not exist.`,
                    color: 0xffa500,
                });
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const newQuestion = new Question({
                userId: interaction.user.id,
                subjectId: subject._id, 
                questionText,
                answer,
            });

            await newQuestion.save();

            const embed = createEmbed({
                title: 'Question Added',
                description: `Question "${questionText}" has been added to the subject "${subject.name}".`,
                color: 0x00ff00,
            });

            interaction.followUp({ embeds: [embed] });
        } catch (error) {
            console.error('Error adding question:', error);
            const embed = createEmbed({
                title: 'Error',
                description: 'An error occurred while adding the question. Please try again later.',
                color: 0xff0000,
            });
            interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    },
};
