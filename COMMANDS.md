# Command Reference

This document provides detailed information about all Discord slash commands available in the XYReviewer bot.

## Command Structure

All commands follow the Discord slash command structure and are implemented as individual modules in the `commands/` directory.

### Base Command Format
```javascript
module.exports = {
    name: 'command-name',
    description: 'Command description',
    async execute(interaction) {
        // Command implementation
    },
};
```

## Subject Management Commands

### `/add-subject`
**File**: `commands/add-subject.js`
**Description**: Creates a new subject for the user

**Parameters**:
- `name` (String, required): The name of the subject to create

**Behavior**:
- Validates that subject name doesn't already exist for the user
- Creates new Subject document in MongoDB
- Returns success/error embed message

**Example**:
```
/add-subject name:Mathematics
```

**Error Cases**:
- Duplicate subject name
- Database connection issues

---

### `/remove-subject`
**File**: `commands/remove-subject.js`
**Description**: Removes a subject and all associated questions

**Parameters**:
- `name` (String, required, autocomplete): The subject to remove

**Behavior**:
- Uses autocomplete to show user's subjects
- Deletes subject and all associated questions
- Returns confirmation embed

**Example**:
```
/remove-subject name:Mathematics
```

**Error Cases**:
- Subject not found
- Database connection issues

---

### `/my-subjects`
**File**: `commands/my-subjects.js`
**Description**: Lists all subjects created by the user

**Parameters**: None

**Behavior**:
- Fetches all subjects for the current user
- Displays in paginated embed format
- Shows creation dates

**Example**:
```
/my-subjects
```

## Question Management Commands

### `/add-question`
**File**: `commands/add-question.js`
**Description**: Adds a question to an existing subject

**Parameters**:
- `subject` (String, required, autocomplete): The subject to add the question to
- `question` (String, required): The question text
- `answer` (String, required): The correct answer

**Behavior**:
- Uses autocomplete to show user's subjects
- Creates new Question document linked to subject
- Validates subject ownership

**Example**:
```
/add-question subject:Mathematics question:"What is 2+2?" answer:"4"
```

**Error Cases**:
- Subject not found
- Subject doesn't belong to user
- Database connection issues

---

### `/remove-question`
**File**: `commands/remove-question.js`
**Description**: Removes a specific question from a subject

**Parameters**:
- `subject` (String, required, autocomplete): The subject containing the question
- `question` (String, required, autocomplete): The question to remove

**Behavior**:
- First autocomplete shows user's subjects
- Second autocomplete shows questions for selected subject
- Removes the selected question

**Example**:
```
/remove-question subject:Mathematics question:"What is 2+2?"
```

**Error Cases**:
- Subject not found
- Question not found
- Ownership validation failures

---

### `/review`
**File**: `commands/review.js`
**Description**: Displays all questions and answers for a subject

**Parameters**:
- `subject` (String, required, autocomplete): The subject to review

**Behavior**:
- Shows all questions with their correct answers
- Formatted in easy-to-read embed
- Useful for studying before taking a quiz

**Example**:
```
/review subject:Mathematics
```

## Quiz Commands

### `/start-quiz`
**File**: `commands/start-quiz.js`
**Description**: Starts an interactive quiz session

**Parameters**:
- `subject` (String, required, autocomplete): The subject to quiz on

**Behavior**:
- Validates user doesn't have ongoing quiz
- Fetches and shuffles questions
- Initiates message collector for answers
- Tracks correct/incorrect responses
- Provides final summary with wrong answers

**Quiz Flow**:
1. User starts quiz
2. First question is displayed
3. User types answer in chat
4. Bot validates and provides feedback
5. Next question is shown
6. Process repeats until all questions answered
7. Final summary is displayed

**Example**:
```
/start-quiz subject:Mathematics
```

**Error Cases**:
- Quiz already in progress
- Subject not found
- No questions available for subject

---

### `/stop-quiz`
**File**: `commands/stop-quiz.js`
**Description**: Stops the currently running quiz

**Parameters**: None

**Behavior**:
- Ends current quiz session
- Cleans up quiz state
- Stops message collector

**Example**:
```
/stop-quiz
```

## Autocomplete Implementation

### Subject Autocomplete
Used in: `add-question`, `remove-question`, `start-quiz`, `review`, `remove-subject`

**Implementation**:
```javascript
const subjects = await Subject.find({ userId }).sort({ createdAt: -1 }).exec();
const choices = subjects.map((subject) => ({
    name: subject.name,
    value: subject._id.toString(), 
}));
await interaction.respond(choices.slice(0, 25));
```

### Question Autocomplete
Used in: `remove-question`

**Implementation**:
```javascript
const questions = await Question.find({ userId, subjectId }).sort({ createdAt: -1 }).exec();
const choices = questions.map((question) => ({
    name: question.questionText.length > 100
        ? question.questionText.slice(0, 97) + '...'
        : question.questionText, 
    value: question._id.toString(), 
}));
await interaction.respond(choices.slice(0, 25));
```

## Error Handling Patterns

### Standard Error Response
```javascript
const embed = createEmbed({
    title: 'Error',
    description: 'Error message here',
    color: 0xff0000,
});
interaction.reply({ embeds: [embed], ephemeral: true });
```

### Success Response
```javascript
const embed = createEmbed({
    title: 'Success Title',
    description: 'Success message here',
});
interaction.reply({ embeds: [embed] });
```

### Warning Response
```javascript
const embed = createEmbed({
    title: 'Warning Title',
    description: 'Warning message here',
    color: 0xffa500,
});
interaction.reply({ embeds: [embed], ephemeral: true });
```

## Quiz State Management

### Quiz State Structure
```javascript
// quizState.js
const ongoingQuizzes = {};

// Quiz object structure
{
    subjectName: String,
    questions: Array,
    currentQuestion: Number,
    correctAnswers: Number,
    wrongAnswers: Array
}
```

### State Operations
- **Create**: When quiz starts
- **Update**: After each answer
- **Delete**: When quiz completes or is stopped
- **Validate**: Check if user has ongoing quiz

## Database Queries

### Common Query Patterns

**Find user's subjects**:
```javascript
const subjects = await Subject.find({ userId }).sort({ createdAt: -1 });
```

**Find questions for subject**:
```javascript
const questions = await Question.find({ subjectId, userId });
```

**Check subject ownership**:
```javascript
const subject = await Subject.findOne({ _id: subjectId, userId });
```

## Embed Helper Usage

All commands use the `embedHelper.js` utility for consistent message formatting:

```javascript
const { createEmbed } = require('../utils/embedHelper');

const embed = createEmbed({
    title: 'Title',
    description: 'Description',
    fields: [{ name: 'Field Name', value: 'Field Value' }],
    color: 0x0099ff
});
```

## Deployment Notes

1. Commands must be registered using `deploy-commands.js`
2. Any parameter changes require redeployment
3. Autocomplete options are dynamically generated
4. All commands support ephemeral responses for errors