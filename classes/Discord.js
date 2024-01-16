const { Client, GatewayIntentBits } = require("discord.js");
const Embed = new (require("./Embed.js"))();
const Quiz = new (require("./Quiz.js"))();

module.exports = class Discord {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });
  }

  onReady() {
    this.client.on("ready", () => {
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
  }

  onMessageCreate() {
    this.client.on("messageCreate", async (msg) => {
      if (msg.author.bot) return;

      const chat = msg.content.toLowerCase();
      const command = chat.slice(3).trim();

      switch (command) {
        case "start":
          if (!Quiz.quizRunning) {
            Quiz.startQuiz(msg);
          } else {
            msg.channel.send({
              embeds: [Embed.errorEmbed("Quiz already started!")],
            });
          }
          break;
        case "answer":
          if (Quiz.quizRunning) {
            msg.channel.send({ embeds: [Embed.answerEmbed(Quiz.Question)] });
          } else {
            msg.channel.send({
              embeds: [Embed.errorEmbed("Please start the quiz first.")],
            });
          }
          break;
        case "review":
          Quiz.review(msg, Quiz);
          break;
        default:
          if (chat.startsWith("xy!")) {
            msg.channel.send({ embeds: [Embed.invalidCommandEmbed()] });
          }
      }
    });
  }

  onInteractionCreate() {
    this.client.on("interactionCreate", (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      const command = interaction.commandName;
      switch (command) {
        case "help":
          interaction.reply({ embeds: [Embed.helpEmbed()] });
          break;
        default:
          interaction.reply({ embeds: [Embed.invalidCommandEmbed()] });
      }
    });
  }

  login(token) {
    this.client.login(token);
  }
};
