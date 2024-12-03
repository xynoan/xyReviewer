require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const Subject = require('./models/Subject');

client.once('ready', () => {
    console.log('Bot is online!');
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

async function createTestSubject(userId) {
    try {
        const testSubject = new Subject({
            userId: userId,
            name: 'Mathematics',
        });
        await testSubject.save();
        console.log('Test subject saved:', testSubject);
    } catch (err) {
        console.error('Error creating test subject:', err);
    }
}

createTestSubject('552020479674941441');

client.login(process.env.DISCORD_TOKEN);