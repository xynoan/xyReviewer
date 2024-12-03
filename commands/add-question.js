const Question = require('../models/Question');
const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'add-question',
    description: 'Adds a question to a subject.',
    async execute(interaction) {
        const subjectName = interaction.options.getString('subject');
        const questionText = interaction.options.getString('question');
        const answer = interaction.options.getString('answer');

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

            const newQuestion = new Question({
                userId: interaction.user.id,
                subjectId: subject._id,
                questionText,
                answer,
            });

            await newQuestion.save();

            const embed = createEmbed({
                title: 'Question Added',
                description: `Question "${questionText}" has been added to subject "${subjectName}".`,
            });

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'An error occurred while adding the question.',
                color: 0xff0000,
            });
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};