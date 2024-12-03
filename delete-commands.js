const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
    try {
        console.log('Fetching current commands...');

        const globalCommands = await rest.get(
            Routes.applicationCommands(process.env.CLIENT_ID)
        );

        for (const command of globalCommands) {
            console.log(`Deleting global command: ${command.name}`);
            await rest.delete(
                Routes.applicationCommand(process.env.CLIENT_ID, command.id)
            );
        }

        const guildCommands = await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
        );

        for (const command of guildCommands) {
            console.log(`Deleting guild command: ${command.name}`);
            await rest.delete(
                Routes.applicationGuildCommand(
                    process.env.CLIENT_ID,
                    process.env.GUILD_ID,
                    command.id
                )
            );
        }

        console.log('All commands deleted successfully.');
    } catch (error) {
        console.error('Error deleting commands:', error);
    }
})();
