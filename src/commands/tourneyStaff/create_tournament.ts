const { SlashCommandBuilder } = require('discord.js');
import { ChatInputCommandInteraction } from 'discord.js';
import { Tournament } from '../../models/index'

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_tournament')
        .setDescription('Start your hosting'),

    async execute(interaction: ChatInputCommandInteraction) {
        const tourney = new Tournament({
            host: 'solar',
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