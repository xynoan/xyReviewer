# XYReviewer Discord Bot

A powerful Discord bot designed to help users create, manage, and take quizzes directly within Discord servers. Perfect for students, educators, and anyone looking to create interactive learning experiences.

## Features

- 📚 **Subject Management**: Create and organize quiz subjects
- ❓ **Question Management**: Add, remove, and review questions for each subject
- 🎯 **Interactive Quizzes**: Take randomized quizzes with real-time feedback
- 📊 **Quiz Results**: Get detailed results with wrong answers highlighted
- 🔍 **Smart Autocomplete**: Easily find subjects and questions with autocomplete
- 👤 **User-Specific**: Each user has their own set of subjects and questions

## Commands

### Subject Management
- `/add-subject <name>` - Create a new subject
- `/remove-subject <name>` - Delete a subject and all its questions
- `/my-subjects` - List all your subjects

### Question Management
- `/add-question <subject> <question> <answer>` - Add a question to a subject
- `/remove-question <subject> <question>` - Remove a question from a subject
- `/review <subject>` - Review all questions for a subject

### Quiz Features
- `/start-quiz <subject>` - Start an interactive quiz
- `/stop-quiz` - Stop the currently running quiz

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB database
- Discord Application with Bot Token

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd xyreviewer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   DISCORD_TOKEN=your_discord_bot_token
   CLIENT_ID=your_discord_application_id
   MONGODB_URI=your_mongodb_connection_string
   PORT=3000
   ```

4. **Deploy Discord Commands**
   ```bash
   node deploy-commands.js
   ```

5. **Start the Bot**
   ```bash
   npm start
   ```

### Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to the "Bot" section
4. Create a bot and copy the token
5. Under "Privileged Gateway Intents", enable:
   - Message Content Intent
6. Generate an invite link with the following permissions:
   - Send Messages
   - Use Slash Commands
   - Read Message History

## Usage Guide

### Getting Started

1. **Create a Subject**
   ```
   /add-subject name:Mathematics
   ```

2. **Add Questions**
   ```
   /add-question subject:Mathematics question:"What is 2+2?" answer:"4"
   ```

3. **Start a Quiz**
   ```
   /start-quiz subject:Mathematics
   ```

4. **Answer Questions**
   Simply type your answers in the chat. The bot will automatically check them and move to the next question.

### Quiz Features

- **Randomized Questions**: Questions are shuffled for each quiz
- **Case-Insensitive Answers**: Answers are checked regardless of capitalization
- **Real-time Feedback**: Get immediate confirmation for correct/incorrect answers
- **Summary Report**: View your final score and review wrong answers
- **One Quiz at a Time**: Only one quiz can run per user at a time

## Technical Details

### Architecture

```
├── index.js              # Main bot entry point
├── server.js            # Express server for health checks
├── deploy-commands.js   # Command registration utility
├── delete-commands.js   # Command cleanup utility
├── quizState.js        # Quiz state management
├── commands/           # Discord slash commands
├── models/            # MongoDB schemas
│   ├── Subject.js     # Subject model
│   └── Question.js    # Question model
└── utils/             # Utility functions
    └── embedHelper.js # Discord embed creation
```

### Database Schema

**Subject Model**
```javascript
{
  userId: String,      // Discord user ID
  name: String,        // Subject name
  createdAt: Date      // Creation timestamp
}
```

**Question Model**
```javascript
{
  userId: String,         // Discord user ID
  subjectId: ObjectId,    // Reference to Subject
  questionText: String,   // The question
  answer: String,         // Correct answer
  createdAt: Date        // Creation timestamp
}
```

### Dependencies

- **discord.js**: Discord API wrapper
- **mongoose**: MongoDB object modeling
- **express**: Web server framework
- **dotenv**: Environment variable management
- **nodemon**: Development auto-restart

## Development

### Running in Development
```bash
npm start  # Uses nodemon for auto-restart
```

### Command Management
```bash
# Deploy new commands
node deploy-commands.js

# Remove all commands (if needed)
node delete-commands.js
```

### Adding New Commands

1. Create a new file in the `commands/` directory
2. Follow the existing command structure:
   ```javascript
   module.exports = {
       name: 'command-name',
       description: 'Command description',
       async execute(interaction) {
           // Command logic here
       },
   };
   ```
3. Update `deploy-commands.js` with the new command definition
4. Deploy the commands using `node deploy-commands.js`

## Features in Detail

### Autocomplete Support
The bot provides intelligent autocomplete for:
- Subject names when adding/removing questions
- Subject names when starting quizzes or reviewing
- Question text when removing specific questions

### Error Handling
- Comprehensive error handling for all commands
- User-friendly error messages
- Graceful fallbacks for database connection issues

### Quiz State Management
- Tracks ongoing quizzes per user
- Prevents multiple simultaneous quizzes
- Automatic cleanup on quiz completion

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For issues, questions, or feature requests, please create an issue in the repository or contact the development team.