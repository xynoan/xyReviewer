const Subject = require('../models/Subject');
const Question = require('../models/Question');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'remove-subject',
    description: 'Removes a subject and all associated questions.',
    async execute(interaction) {
        const subjectName = interaction.options.getString('name');

        try {
            const subject = await Subject.findOneAndDelete({
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

            await Question.deleteMany({ subjectId: subject._id });

            const embed = createEmbed({
                title: 'Subject Removed',
                description: `Subject "${subjectName}" and all associated questions have been removed.`,
            });

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'Failed to remove the subject. Please try again later.',
                color: 0xff0000,
            });
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};