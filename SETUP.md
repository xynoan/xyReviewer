# Setup and Configuration Guide

This guide will walk you through setting up the XYReviewer Discord bot from scratch.

## Prerequisites

Before starting, ensure you have:
- Node.js 16.x or higher installed
- A MongoDB database (local or cloud-based like MongoDB Atlas)
- A Discord account

## Step 1: Discord Application Setup

### 1.1 Create Discord Application

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application"
3. Give it a name (e.g., "XYReviewer")
4. Click "Create"

### 1.2 Configure Bot

1. Navigate to the "Bot" section in the left sidebar
2. Click "Add Bot"
3. Under "Token", click "Copy" to get your bot token
4. **Important**: Keep this token secret!

### 1.3 Set Bot Permissions

Under "Privileged Gateway Intents", enable:
- ✅ **Message Content Intent** (required for quiz responses)

### 1.4 Get Application ID

1. Go to "General Information" section
2. Copy the "Application ID" (also called Client ID)

## Step 2: MongoDB Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user with read/write permissions
5. Whitelist your IP address (or use 0.0.0.0/0 for any IP)
6. Get your connection string (it looks like):
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database_name
   ```

### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Your connection string will be:
   ```
   mongodb://localhost:27017/xyreviewer
   ```

## Step 3: Environment Configuration

Create a `.env` file in your project root:

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_bot_token_here
CLIENT_ID=your_application_id_here

# Database Configuration
MONGODB_URI=your_mongodb_connection_string

# Server Configuration (Optional)
PORT=3000
```

### Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `DISCORD_TOKEN` | Bot token from Discord Developer Portal | `MTIzNDU2Nzg5MDEyMzQ1Njc4.GhIjKl.xyz...` |
| `CLIENT_ID` | Application ID from Discord Developer Portal | `123456789012345678` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.net/db` |
| `PORT` | Port for Express server (optional) | `3000` |

## Step 4: Installation and Setup

### 4.1 Install Dependencies

```bash
npm install
```

### 4.2 Deploy Commands to Discord

```bash
node deploy-commands.js
```

You should see:
```
Registering slash commands...
Slash commands registered successfully.
```

### 4.3 Start the Bot

```bash
npm start
```

You should see:
```
Server is running on port 3000
Connected to MongoDB
Bot is online!
```

## Step 5: Invite Bot to Server

### 5.1 Generate Invite Link

1. In Discord Developer Portal, go to "OAuth2" → "URL Generator"
2. Select scopes:
   - ✅ `bot`
   - ✅ `applications.commands`
3. Select bot permissions:
   - ✅ Send Messages
   - ✅ Use Slash Commands
   - ✅ Read Message History
   - ✅ Embed Links
4. Copy the generated URL

### 5.2 Add to Server

1. Open the invite URL in your browser
2. Select the server you want to add the bot to
3. Click "Authorize"

## Step 6: Verify Installation

Test the bot by running these commands in your Discord server:

1. `/add-subject name:Test` - Should create a test subject
2. `/add-question subject:Test question:What is 1+1? answer:2` - Should add a question
3. `/start-quiz subject:Test` - Should start a quiz
4. Type `2` in chat - Should respond with "Correct!"

## Troubleshooting

### Common Issues

#### "Bot is not responding"
- Check that bot token is correct in `.env`
- Verify bot has necessary permissions in Discord server
- Check console for error messages

#### "Commands not showing up"
- Run `node deploy-commands.js` again
- Wait a few minutes for Discord to update
- Try restarting Discord client

#### "Database connection failed"
- Verify MongoDB URI is correct
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

#### "Permission denied errors"
- Check bot permissions in Discord server
- Ensure bot role is above other roles it needs to interact with

### Debug Mode

Add this to your `.env` for more detailed logging:
```env
NODE_ENV=development
DEBUG=true
```

### Logs

The bot logs important events:
- Database connections
- Command registrations
- Error messages
- User interactions

Monitor the console output for troubleshooting.

## Production Deployment

### Environment Considerations

For production deployment:

1. **Security**:
   - Never commit `.env` file to version control
   - Use environment variables in production platforms
   - Regenerate tokens if accidentally exposed

2. **Database**:
   - Use MongoDB Atlas for production
   - Enable authentication
   - Regular backups

3. **Hosting Options**:
   - Heroku
   - Railway
   - DigitalOcean
   - AWS EC2
   - Google Cloud Platform

### Heroku Deployment Example

1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables:
   ```bash
   heroku config:set DISCORD_TOKEN=your_token
   heroku config:set CLIENT_ID=your_client_id
   heroku config:set MONGODB_URI=your_mongo_uri
   ```
4. Deploy: `git push heroku main`
5. Scale: `heroku ps:scale worker=1`

### Railway Deployment Example

1. Connect GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

## Maintenance

### Regular Tasks

1. **Monitor logs** for errors or unusual activity
2. **Update dependencies** regularly:
   ```bash
   npm update
   npm audit fix
   ```
3. **Backup database** regularly
4. **Monitor Discord API changes** that might affect bot functionality

### Command Updates

When adding new commands:
1. Create command file in `commands/` directory
2. Update `deploy-commands.js` with new command definition
3. Run `node deploy-commands.js`
4. Test new command thoroughly

## Security Best Practices

1. **Token Security**:
   - Never share bot tokens
   - Regenerate if compromised
   - Use environment variables, not hardcoded values

2. **Database Security**:
   - Use strong passwords
   - Enable MongoDB authentication
   - Restrict IP access when possible

3. **Bot Permissions**:
   - Only grant necessary permissions
   - Regularly audit bot access
   - Use role-based restrictions in Discord

4. **Code Security**:
   - Input validation on all user inputs
   - SQL injection prevention (using Mongoose helps)
   - Regular dependency updates

## Support

If you encounter issues not covered in this guide:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Test with a minimal setup (one command)
4. Check Discord.js documentation for API changes
5. Review MongoDB connection status