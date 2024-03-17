const Helper = new (require("./Helper.js"))();
const PE4 = require("../subjects/PE4.js");

module.exports = class Question {

  constructor() {
    this.question = "";
    this.answer = "";
    this.askedArray = [];
    this.questionnaireString = `=============================================================\n\t\t\t\t\t\t\t\t\t\tCheat Sheet (${this.getLength()} questions)\n=============================================================\n`;
  }

  resetReviewer() {
    this.questionnaireString = `=============================================================\n\t\t\t\t\t\t\t\t\t\tCheat Sheet (${this.getLength()} questions)\n=============================================================\n`;
  }

  reset() {
    this.question = "";
    this.answer = "";
    this.askedArray = [];
  }

  alreadyAsked(question) {
    if (this.askedArray.includes(question)) {
      return true;
    }
    this.askedArray.push(question);
    return false;
  }

  rollQuestion() {
    const newQuestion = Helper.randomProperty(this.questionAndAnswer());
    this.question = newQuestion.key;
    this.answer = newQuestion.value;
  }
  
  getQuestion() {
    return this.question;
  }

  getAnswer() {
    return this.answer;
  }

  getLength() {
    return Object.keys(this.questionAndAnswer()).length;
  }

  questionAndAnswer() {
    return PE4;
  }
}
