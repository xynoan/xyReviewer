module.exports = class Helper {
  
    randomProperty(object) {
      const keys = Object.keys(object);
      if (keys.length > 0) {
        const index = Math.floor(keys.length * Math.random());
        const key = keys[index];
        const value = object[key];
        return { index, key, value };
      }
      return null;
    }
  
    appendQAonCheatSheet(Question) {
      for (const [question, answer] of Object.entries(Question.questionAndAnswer())) {
        Question.questionnaireString += question + "\n" + "Answer: " + answer + "\n\n";
      }
    };
    
  }
  