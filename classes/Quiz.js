const Embed = new (require("./Embed.js"))();
const Helper = new (require("./Helper.js"))();

module.exports = class Quiz {
  constructor() {
    this.quizRunning = false;
    this.Question = new (require("./Question.js"))();
  }

  review(msg, Quiz) {
    Helper.appendQAonCheatSheet(Quiz.Question);
    if (Quiz.Question.questionnaireString.length > 2000) {
      const messageChunks = Quiz.Question.questionnaireString.match(/[\s\S]{1,2000}/g) || [];
      for (const chunk of messageChunks) {
        msg.author.send(chunk);
      }
    } else {
      msg.author.send(Quiz.Question.questionnaireString);
    }
    Quiz.Question.resetReviewer();
    msg.channel.send({ embeds: [Embed.sentReviewerEmbed(`${msg.author}`)] });
  }

  async startQuiz(msg) {
    this.quizRunning = true;
    this.resetQuestions();
    this.sendWelcomeMessage(msg);

    for (let i = 1; i <= this.getQuestionsLength(); i++) {
      this.askQuestion(msg, i);
      await this.responseCollector(msg);
    }

    this.endQuiz(msg);
  }

  sendWelcomeMessage(msg) {
    msg.channel.send({ embeds: [Embed.welcomeEmbed()] });
  }

  askQuestion(msg, questionNumber) {
    this.rollQuestion();

    if (this.alreadyAsked(this.getQuestion())) {
      this.askQuestion(msg, questionNumber);
      return;
    }

    msg.channel.send({ embeds: [Embed.questionEmbed(questionNumber, this.getQuestion())] });
  }

  async responseCollector(msg) {
    return new Promise(async (resolve) => {
      const filter = (response) => {
        if (response.author.bot) return;
        const userAnswer = response.content.toLowerCase();
        return userAnswer === this.getAnswer().toLowerCase();
      };

      const collected = await msg.channel.awaitMessages({ filter, max: 1 });
      
      await msg.channel.send({ embeds: [Embed.correctAnswerEmbed(collected, this)] });

      resolve();
    });
  }

  endQuiz(msg) {
    this.quizRunning = false;
    msg.channel.send({ embeds: [Embed.finalEmbed()] });
    this.resetQuestions();
  }

  resetQuestions() {
    this.Question.reset();
  }

  rollQuestion() {
    this.Question.rollQuestion();
  }

  alreadyAsked(question) {
    return this.Question.alreadyAsked(question);
  }

  getQuestion() {
    return this.Question.getQuestion();
  }

  getAnswer() {
    return this.Question.getAnswer();
  }

  getQuestionsLength() {
    return this.Question.getLength();
  }
  
}