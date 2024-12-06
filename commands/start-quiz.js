const { ongoingQuizzes } = require('../quizState');
const Question = require('../models/Question');
const Subject = require('../models/Subject');
const { createEmbed } = require('../utils/embedHelper');

module.exports = {
    name: 'start-quiz',
    description: 'Starts a quiz for a subject.',
    async execute(interaction) {
        const subjectId = interaction.options.getString('subject'); // Retrieve subject ID from options
        await interaction.deferReply({ ephemeral: true });

        if (!subjectId) {
            const embed = createEmbed({
                title: 'Error',
                description: 'You must provide a subject.',
                color: 0xff0000,
            });
            return interaction.followUp({ embeds: [embed], ephemeral: true });
        }

        if (ongoingQuizzes[interaction.user.id]) {
            const embed = createEmbed({
                title: 'Quiz Already Running',
                description: 'You already have a quiz in progress. Use `/stop-quiz` to end it.',
                color: 0xffa500,
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
                    description: 'The selected subject does not exist.',
                    color: 0xffa500,
                });
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const subjectName = subject.name;

            const questions = await Question.find({ subjectId: subject._id });

            if (questions.length === 0) {
                const embed = createEmbed({
                    title: 'No Questions Found',
                    description: `No questions available for subject "${subjectName}".`,
                    color: 0xffa500,
                });
                return interaction.followUp({ embeds: [embed], ephemeral: true });
            }

            const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

            // Initialize the quiz
            ongoingQuizzes[interaction.user.id] = {
                subjectName,
                questions: shuffledQuestions,
                currentQuestion: 0,
                correctAnswers: 0,
                wrongAnswers: [],
            };

            const firstQuestion = shuffledQuestions[0];
            const embed = createEmbed({
                title: `Quiz Started`,
                description: `Starting quiz for "${subjectName}".\n\n**Question 1:**\n${firstQuestion.questionText}`,
                color: 0x0099ff,
            });

            interaction.followUp({ embeds: [embed] });

            const filter = (response) => response.author.id === interaction.user.id;
            const collector = interaction.channel.createMessageCollector({ filter });

            collector.on('collect', (response) => {
                const quiz = ongoingQuizzes[interaction.user.id];

                if (!quiz) {
                    collector.stop();
                    return;
                }

                const currentQuestion = quiz.questions[quiz.currentQuestion];

                if (response.content.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
                    quiz.correctAnswers += 1;
                    response.reply('Correct!');
                } else {
                    quiz.wrongAnswers.push({
                        question: currentQuestion.questionText,
                        correctAnswer: currentQuestion.answer,
                    });
                    response.reply(`Wrong! The correct answer was: ${currentQuestion.answer}`);
                }

                quiz.currentQuestion += 1;

                if (quiz.currentQuestion >= quiz.questions.length) {
                    const summaryEmbed = createEmbed({
                        title: 'Quiz Completed',
                        description: `Quiz completed! You got ${quiz.correctAnswers} out of ${quiz.questions.length} correct.`,
                        color: 0x0099ff,
                    });

                    if (quiz.wrongAnswers.length > 0) {
                        summaryEmbed.addFields({
                            name: 'Wrong Answers',
                            value: quiz.wrongAnswers
                                .map((item) => `${item.question} (Correct: ${item.correctAnswer})`)
                                .join('\n'),
                        });
                    }

                    response.reply({ embeds: [summaryEmbed] });
                    delete ongoingQuizzes[interaction.user.id];
                    collector.stop();
                } else {
                    const nextQuestion = quiz.questions[quiz.currentQuestion];
                    const nextQuestionEmbed = createEmbed({
                        title: `Question ${quiz.currentQuestion + 1}`,
                        description: `${nextQuestion.questionText}`,
                        color: 0x0099ff,
                    });

                    response.channel.send({ embeds: [nextQuestionEmbed] });
                }
            });
        } catch (error) {
            console.error(error);
            const embed = createEmbed({
                title: 'Error',
                description: 'Failed to start the quiz. Please try again later.',
                color: 0xff0000,
            });
            interaction.followUp({ embeds: [embed], ephemeral: true });
        }
    },
};