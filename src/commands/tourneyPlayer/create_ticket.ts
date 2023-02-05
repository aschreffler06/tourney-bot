const { SlashCommandBuilder } = require('discord.js');
import { ChatInputCommandInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping3')
        .setDescription('Replies with Pong!'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Pong!');
    },
};
