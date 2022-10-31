const { SlashCommandBuilder } = require('discord.js');
import { ChatInputCommandInteraction } from 'discord.js';
import { Command } from './Command';

// export const ping: Command = {
//     data: new SlashCommandBuilder()
//         .setName('ping')
//         .setDescription('Replies with Pong!'),

//     execute: async (interaction: ChatInputCommandInteraction) =>  {
//         await interaction.reply('Pong!');
//     },
// };


module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply('Pong!');
    },
};
