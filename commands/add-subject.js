const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'add-subject',
    description: 'Adds a new subject for the user.',
    async execute(interaction) {
        const subjectName = interaction.options.getString('name');
        try {
            const existingSubject = await Subject.findOne({
                userId: interaction.user.id,
                name: subjectName,
            });

            if (existingSubject) {
                const embed = createEmbed({
                    title: 'Duplicate Subject',
                    description: `You already have a subject named "${subjectName}".`,
                    color: 0xffa500,
                });
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }

            const newSubject = new Subject({
                userId: interaction.user.id,
                name: subjectName,
            });

            await newSubject.save();

            const embed = createEmbed({
                title: 'Subject Added',
                description: `Subject "${subjectName}" has been added successfully.`,
            });

            interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'An error occurred while adding the subject.',
                color: 0xff0000,
            });
            interaction.reply({ embeds: [embed], ephemeral: true });
        }
    },
};
