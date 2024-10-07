const { userScores, userQuizzes, lastQuestionMessages, quizTimers } = require('../utils/quizState');
const startQuiz = require('../utils/startQuiz');
const loadSubjects = require('../utils/loadSubjects');
let subjects = loadSubjects();
const fs = require('fs');
const path = require('path');
const setupCommands = require('../commands/setupCommands');
require('dotenv').config();

module.exports = function setupEventHandlers(client) {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isCommand()) return;

        if (interaction.commandName === 'quiz') {
            const userId = interaction.user.id;
            const subject = interaction.options.getString('subject');

            if (userQuizzes.has(userId)) {
                userQuizzes.get(userId).abort();
            }

            const quizController = new AbortController();
            userQuizzes.set(userId, quizController);

            userScores.set(userId, 0);

            try {
                await interaction.reply({ content: `Starting a new ${subject} quiz!`, ephemeral: true });
                await startQuiz(interaction, quizController.signal, subjects[subject], subject);
            } catch (error) {
                console.error('Error in quiz command:', error);
                try {
                    await interaction.followUp({ content: 'An error occurred while starting the quiz. Please try again.', ephemeral: true });
                } catch (followUpError) {
                    console.error('Error sending follow-up message:', followUpError);
                }
            } finally {
                userQuizzes.delete(userId);
            }
        } else if (interaction.commandName === 'review') {
            const subject = interaction.options.getString('subject');
            
            try {
                await interaction.deferReply({ ephemeral: true });
                
                const subjectQuestions = subjects[subject];
                if (!subjectQuestions || subjectQuestions.length === 0) {
                    await interaction.editReply({ content: `No questions found for ${subject}.`, ephemeral: true });
                    return;
                }

                const reviewMessages = subjectQuestions.map((q, index) => {
                    let answerText = q.answer;
                    if (q.type === 'multiple-choice') {
                        // Find the full text of the correct answer
                        answerText = q.options.find(option => option.startsWith(q.answer));
                    } else if (q.type === 'enumeration') {
                        answerText = q.answer.join(', ');
                    }
                    return `Question ${index + 1}: ${q.question}\nAnswer: ${answerText}`;
                });

                // Send messages in chunks
                const chunkSize = 5; // Adjust this number to fit within Discord's limit
                for (let i = 0; i < reviewMessages.length; i += chunkSize) {
                    const chunk = reviewMessages.slice(i, i + chunkSize);
                    const messageContent = `Review for ${subject} (Part ${Math.floor(i / chunkSize) + 1}):\n\n${chunk.join('\n\n')}`;
                    
                    if (i === 0) {
                        await interaction.editReply({ content: messageContent, ephemeral: true });
                    } else {
                        await interaction.followUp({ content: messageContent, ephemeral: true });
                    }
                }
            } catch (error) {
                console.error('Error in review command:', error);
                try {
                    await interaction.editReply({ content: 'An error occurred while preparing the review. Please try again.', ephemeral: true });
                } catch (followUpError) {
                    console.error('Error sending follow-up message:', followUpError);
                }
            }
        }

        else if (interaction.commandName === 'add') {
            if (interaction.user.id !== process.env.ADMIN_USER_ID) {
                await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
                return;
            }

            // Defer the reply immediately
            await interaction.deferReply({ ephemeral: true });

            const subject = interaction.options.getString('subject');
            const type = interaction.options.getString('type');
            const question = interaction.options.getString('question');
            const answer = interaction.options.getString('answer');
            const options = interaction.options.getString('options');

            try {
                const newQuestion = {
                    type: type,
                    question: question,
                    answer: type === 'multiple-choice' ? answer : answer.split(',').map(a => a.trim()),
                };

                if (type === 'multiple-choice') {
                    if (!options) {
                        await interaction.editReply({ content: 'Options are required for multiple-choice questions.', ephemeral: true });
                        return;
                    }
                    newQuestion.options = options.split(',').map((opt, index) => `${String.fromCharCode(65 + index)}) ${opt.trim()}`);
                } else if (type === 'enumeration') {
                    newQuestion.orderMatters = false;
                }

                const subjectPath = path.join(__dirname, '..', 'subjects', `${subject}.js`);
                let subjectQuestions = require(subjectPath);
                
                // Ensure subjectQuestions is an array
                if (!Array.isArray(subjectQuestions)) {
                    subjectQuestions = [];
                }
                
                subjectQuestions.push(newQuestion);

                fs.writeFileSync(subjectPath, `module.exports = ${JSON.stringify(subjectQuestions, null, 2)};`);

                await interaction.editReply({ content: `Question added to ${subject} successfully!`, ephemeral: true });
            } catch (error) {
                console.error('Error adding question:', error);
                await interaction.editReply({ content: 'An error occurred while adding the question.', ephemeral: true });
            }
        }

        else if (interaction.commandName === 'remove') {
            if (interaction.user.id !== ADMIN_USER_ID) {
                await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
                return;
            }

            const subject = interaction.options.getString('subject');
            const index = interaction.options.getInteger('index') - 1; 

            await interaction.deferReply({ ephemeral: true });

            try {
                const subjectPath = path.join(__dirname, '..', 'subjects', `${subject}.js`);
                
                if (!fs.existsSync(subjectPath)) {
                    await interaction.editReply({ content: `Subject file for "${subject}" not found.`, ephemeral: true });
                    return;
                }

                let subjectQuestions = require(subjectPath);

                if (!Array.isArray(subjectQuestions)) {
                    await interaction.editReply({ content: `Invalid format in subject file for "${subject}". Expected an array of questions.`, ephemeral: true });
                    return;
                }

                if (index < 0 || index >= subjectQuestions.length) {
                    await interaction.editReply({ content: `Invalid question index. The subject "${subject}" has ${subjectQuestions.length} questions (indices 1 to ${subjectQuestions.length}).`, ephemeral: true });
                    return;
                }

                const removedQuestion = subjectQuestions.splice(index, 1)[0];

                fs.writeFileSync(subjectPath, `module.exports = ${JSON.stringify(subjectQuestions, null, 2)};`);

                await interaction.editReply({ content: `Question removed from ${subject} successfully!\nRemoved question: "${removedQuestion.question}"`, ephemeral: true });

                subjects = loadSubjects();

                await setupCommands(client)();
            } catch (error) {
                console.error('Error removing question:', error);
                await interaction.editReply({ content: `An error occurred while removing the question: ${error.message}`, ephemeral: true });
            }
        }

        else if (interaction.commandName === 'reload-subjects') {
            if (interaction.user.id !== ADMIN_USER_ID) {
                await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
                return;
            }

            try {
                subjects = loadSubjects();

                await setupCommands(client)();

                await interaction.reply({ content: 'Subjects successfully reloaded and commands re-registered!', ephemeral: true });
            } catch (error) {
                console.error('Error reloading subjects or re-registering commands:', error);
                await interaction.reply({ content: 'An error occurred while reloading subjects or re-registering commands.', ephemeral: true });
            }
        }

        else if (interaction.commandName === 'stop-quiz') {
            const userId = interaction.user.id;
            
            if (userQuizzes.has(userId)) {
                userQuizzes.get(userId).abort();
                userQuizzes.delete(userId);
                
                clearTimeout(quizTimers.get(userId));
                quizTimers.delete(userId);
                
                const lastMessage = lastQuestionMessages.get(userId);
                if (lastMessage) {
                    try {
                        await lastMessage.delete();
                    } catch (error) {
                        console.error('Error deleting last question message:', error);
                    }
                    lastQuestionMessages.delete(userId);
                }
                
                await interaction.channel.send(`<@${userId}> has stopped their quiz.`);
                
                await interaction.reply({ content: 'You have stopped your quiz.', ephemeral: true });
            } else {
                await interaction.reply({ content: 'You don\'t have an active quiz to stop.', ephemeral: true });
            }
        }

        if (interaction.isAutocomplete()) {
            if (interaction.commandName === 'remove' && interaction.options.getFocused(true).name === 'question') {
                const subject = interaction.options.getString('subject');
                if (subject && subjects[subject]) {
                    const questions = subjects[subject].map(q => q.question);
                    const focusedValue = interaction.options.getFocused();
                    const filtered = questions.filter(question => question.startsWith(focusedValue)).slice(0, 25);
                    await interaction.respond(
                        filtered.map(question => ({ name: question, value: question }))
                    );
                } else {
                    await interaction.respond([]);
                }
            }
        }
    });
};