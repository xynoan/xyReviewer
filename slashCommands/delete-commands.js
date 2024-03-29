const { REST, Routes } = require('discord.js');
const rest = new REST().setToken(process.env.TOKEN);

rest.put(Routes.applicationCommands(process.env.clientId), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);