const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'add-subject',
    description: 'Adds a new subject for the user.',
    async execute(message, args) {
        const subjectName = args.join(' ');
        if (!subjectName) {
            const embed = createEmbed({
                title: 'Error',
                description: 'Please provide a subject name.',
                color: 0xff0000,
            });
            return message.reply({ embeds: [embed] });
        }

        try {
            const existingSubject = await Subject.findOne({
                userId: message.author.id,
                name: subjectName,
            });

            if (existingSubject) {
                const embed = createEmbed({
                    title: 'Duplicate Subject',
                    description: `You already have a subject named "${subjectName}".`,
                    color: 0xffa500,
                });
                return message.reply({ embeds: [embed] });
            }

            const newSubject = new Subject({
                userId: message.author.id,
                name: subjectName,
            });

            await newSubject.save();

            const embed = createEmbed({
                title: 'Subject Added',
                description: `Subject "${subjectName}" has been added successfully.`,
            });

            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'An error occurred while adding the subject.',
                color: 0xff0000,
            });
            message.reply({ embeds: [embed] });
        }
    },
};
