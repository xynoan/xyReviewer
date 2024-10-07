const { userScores, userQuizzes, lastQuestionMessages, quizTimers } = require('./quizState');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const QUIZ_TIMEOUT = 20 * 60 * 1000; // 20 minutes

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function startQuiz(interaction, signal, quizQuestions, subject) {
    try {
        const scores = new Map();
        await announceQuizStart(interaction, subject);

        const randomizedQuestions = shuffleArray([...quizQuestions]);

        for (const [index, question] of randomizedQuestions.entries()) {
            if (signal.aborted) return;
            await handleQuestion(interaction, signal, question, scores, index);
        }

        if (signal.aborted) return;
        updateGlobalScores(scores);
        await sendLeaderboard(interaction, scores);
    } catch (error) {
        if (!signal.aborted) {
            console.error("Error in startQuiz:", error);
            await interaction.channel.send("An error occurred while running the quiz. Please try again.");
        }
    } finally {
        clearTimeout(quizTimers.get(interaction.user.id));
        quizTimers.delete(interaction.user.id);
    }
}

async function handleQuestion(interaction, signal, question, scores, index) {
    try {
        if (signal.aborted) return;
        
        clearTimeout(quizTimers.get(interaction.user.id));
        
        const timer = setTimeout(() => {
            const controller = userQuizzes.get(interaction.user.id);
            if (controller) {
                controller.abort();
            }
            interaction.channel.send(`The quiz for <@${interaction.user.id}> has been automatically stopped due to inactivity.`);
        }, QUIZ_TIMEOUT);
        
        quizTimers.set(interaction.user.id, timer);
        
        if (question.type === 'multiple-choice') {
            await handleMultipleChoiceQuestion(interaction, signal, question, scores, index);
        } else if (question.type === 'enumeration') {
            await handleEnumerationQuestion(interaction, signal, question, scores, index);
        }
    } catch (error) {
        if (signal.aborted) return;
        console.error(`Error in question ${index + 1}:`, error);
        await interaction.channel.send(`There was an error with question ${index + 1}. Moving to the next question.`);
    }
}

async function handleMultipleChoiceQuestion(interaction, signal, question, scores, questionIndex) {
    const { quizEmbed, row } = createMultipleChoiceEmbed(question, questionIndex);
    const questionMessage = await interaction.channel.send({ embeds: [quizEmbed], components: [row] });
    
    lastQuestionMessages.set(interaction.user.id, questionMessage);

    try {
        const buttonInteraction = await awaitButtonInteraction(questionMessage, signal);
        await processMultipleChoiceAnswer(buttonInteraction, question, scores, questionMessage, interaction);
    } catch (error) {
        await handleQuestionError(error, signal, questionMessage);
    }
}

async function handleEnumerationQuestion(interaction, signal, question, scores, questionIndex) {
    const quizEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`Question ${questionIndex + 1} (Enumeration)`)
        .setDescription(question.question);

    const questionMessage = await interaction.channel.send({ embeds: [quizEmbed] });
    
    lastQuestionMessages.set(interaction.user.id, questionMessage);

    try {
        const messageResponse = await interaction.channel.awaitMessages({
            filter: m => m.author.id !== interaction.client.user.id,
            max: 1,
            signal
        });

        const responderId = messageResponse.first().author.id;
        const userAnswer = messageResponse.first().content.toLowerCase().split(',').map(item => item.trim());
        const correctAnswers = question.answer.map(item => item.toLowerCase());

        const isCorrect = question.orderMatters
            ? JSON.stringify(userAnswer) === JSON.stringify(correctAnswers)
            : userAnswer.length === correctAnswers.length && userAnswer.every(item => correctAnswers.includes(item));

        if (isCorrect) {
            scores.set(responderId, (scores.get(responderId) || 0) + 1);
            await interaction.channel.send(`<@${responderId}> scored a point!`);
        } else {
            await interaction.channel.send(`Wrong answer. The correct answer was: ${question.answer.join(', ')}`);
        }

    } catch (e) {
        if (signal.aborted) return;
        if (e.name === 'AbortError') return;
    }
}

function createMultipleChoiceEmbed(question, questionIndex) {
    const quizEmbed = new EmbedBuilder()
        .setColor('#0099ff')
        .setTitle(`Question ${questionIndex + 1}`)
        .setDescription(question.question);

    const row = new ActionRowBuilder()
        .addComponents(
            question.options.map((option, index) => 
                new ButtonBuilder()
                    .setCustomId(String.fromCharCode(65 + index))
                    .setLabel(option) 
                    .setStyle(ButtonStyle.Primary)
            )
        );

    return { quizEmbed, row };
}

async function awaitButtonInteraction(questionMessage, signal) {
    return await questionMessage.awaitMessageComponent({ 
        filter: i => i.user.id !== questionMessage.client.user.id,
        signal
    });
}

async function processMultipleChoiceAnswer(buttonInteraction, question, scores, questionMessage, interaction) {
    const answer = buttonInteraction.customId;
    const responderId = buttonInteraction.user.id;

    if (answer === question.answer) {
        scores.set(responderId, (scores.get(responderId) || 0) + 1);
        await buttonInteraction.deferUpdate();
        await questionMessage.edit({ content: `<@${responderId}> answered correctly!`, embeds: [], components: [] });
    } else {
        const correctAnswerText = question.options.find(option => option.startsWith(question.answer));
        const responseContent = `Wrong answer. The correct answer was: ${correctAnswerText}`;
        await buttonInteraction.update({ content: responseContent, embeds: [], components: [] });
    }
}

async function handleQuestionError(error, signal, questionMessage) {
    if (signal.aborted || error.name === 'AbortError') return;
    throw error;
}

function updateGlobalScores(scores) {
    for (const [userId, score] of scores) {
        userScores.set(userId, (userScores.get(userId) || 0) + score);
    }
}

async function announceQuizStart(interaction, subject) {
    await interaction.channel.send(`<@${interaction.user.id}> has started a quiz on ${subject}! Everyone can participate!`);
}

async function sendLeaderboard(interaction, scores) {
    const leaderboard = Array.from(scores.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([userId, score], index) => `${index + 1}. <@${userId}>: ${score} points`);

    const scoreEmbed = new EmbedBuilder()
        .setColor('#00FFFF')
        .setTitle('Quiz Completed!')
        .setDescription(`Here are the results:`)
        .addFields(
            { name: 'Leaderboard', value: leaderboard.join('\n') || 'No participants' }
        );

    await interaction.channel.send({ embeds: [scoreEmbed] });
}

module.exports = startQuiz;