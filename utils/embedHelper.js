const { EmbedBuilder } = require('discord.js');

function createEmbed({ title, description, fields, color = 0x0099ff }) {
    const embed = new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description);

    if (fields) {
        embed.addFields(fields);
    }

    return embed;
}

module.exports = { createEmbed };