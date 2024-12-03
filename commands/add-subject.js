const Subject = require('../models/Subject');

module.exports = {
    name: 'add-subject',
    description: 'Adds a new subject for the user.',
    async execute(message, args) {
        const subjectName = args.join(' ');
        if (!subjectName) {
            return message.reply('Please provide a subject name.');
        }

        try {
            // Check for duplicate subjects
            const existingSubject = await Subject.findOne({
                userId: message.author.id,
                name: subjectName,
            });
            if (existingSubject) {
                return message.reply(`You already have a subject named "${subjectName}".`);
            }

            // Create and save a new subject
            const newSubject = new Subject({
                userId: message.author.id,
                name: subjectName,
            });
            await newSubject.save();
            message.reply(`Subject "${subjectName}" added successfully.`);
        } catch (error) {
            console.error(error);
            message.reply('Failed to add the subject.');
        }
    },
};
