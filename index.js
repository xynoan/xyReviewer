const keepAlive = require("./server");
const Discord = new (require("./classes/Discord.js"))();
require('dotenv').config()

Discord.onReady();

Discord.onMessageCreate();

Discord.onInteractionCreate();

keepAlive();
Discord.login(process.env.TOKEN);