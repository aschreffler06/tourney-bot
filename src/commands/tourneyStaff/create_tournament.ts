const { SlashCommandBuilder } = require('discord.js');
import { ChatInputCommandInteraction } from 'discord.js';
import { Tournament } from '../../models/index';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_tournament')
        .setDescription('Start your hosting')
        .addStringOption((option: any) =>
            option
                .setName('name')
                .setDescription('Name of the tournament')
                .setRequired(true)),

    async execute(interaction: ChatInputCommandInteraction) {
        const host: string = interaction.user.id;
        const name: string = interaction.options.getString('name')!;

        const tourney = new Tournament({
            host: host,
            name: name,
            forumPost: 'yes.com',
            acronym: 'URMOM',
            minTeamSize: 1,
            maxTeamSize: 2,
            guildId: interaction.guildId,
            numQualify: 32
        })

        await tourney.save();
        await interaction.reply('done');
    }
}