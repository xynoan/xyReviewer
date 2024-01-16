require('dotenv').config();
const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'help',
    description: 'Lists of commands.',
  }
];

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationCommands(process.env.clientId),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();