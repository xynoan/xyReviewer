const { EmbedBuilder } = require("discord.js");
const Question = new (require("./Question.js"))();

module.exports = class Embed {
  
  welcomeEmbed() {
    const questionCount = Question.getLength();
    return new EmbedBuilder()
    .setColor("Yellow")
    .setTitle("Welcome!")
    .setDescription(`There are a total of ${questionCount} questions! Good Luck!`);
  }

  questionEmbed(questionNumber, question) {
    return new EmbedBuilder()
        .setColor("Red")
        .setTitle(`Question ${questionNumber}`)
        .setDescription(question);
  }

  finalEmbed() {
    return new EmbedBuilder()
    .setColor("Yellow")
    .setTitle("Thank you!")
    .setImage('attachment://eser_meme.jpg')
    .setDescription("That's all the questions :grin:");
  }

  answerEmbed(Question) {
    return new EmbedBuilder()
    .setColor("Green")
    .setTitle("Answer")
    .setDescription(Question.getAnswer());
  }

  correctAnswerEmbed(collected, Question) {
    return new EmbedBuilder()
    .setColor("Green")
    .setTitle("aye, ez")
    .setDescription(`${collected.first().author} got the correct answer: ${Question.getAnswer()}`);
  }

  invalidCommandEmbed() {
    return new EmbedBuilder()
    .setColor("Red")
    .setTitle("Invalid Command!")
    .setDescription("Please see `/help` for instructions.");
  }

  errorEmbed(description) {
    return new EmbedBuilder()
    .setColor("Red")
    .setTitle("Error!")
    .setDescription(description);
  }

  WIP(){
    return new EmbedBuilder()
    .setColor("Yellow")
    .setTitle("Work In Progress!");
  }

  helpEmbed() {
    return new EmbedBuilder()
    .setColor("Yellow")
    .setTitle('xyReviewer Commands')
    .addFields(
      { name: '`xy!start`', value: 'Starts the mock-quiz.'},
      { name: '`xy!answer`', value: 'Gives you the answer to the current question.'},
      { name: '`xy!review`', value: 'Dm\'s you a reviewer.'}
    );
  }

  sentReviewerEmbed(author) {
    return new EmbedBuilder()
    .setColor("Green")
    .setTitle("Success!")
    .setDescription("Sent reviewer to " + author + "!");
  }
  
}