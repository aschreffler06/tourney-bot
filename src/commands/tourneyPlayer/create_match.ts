import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { DateTime } from 'luxon';
import { Match } from '../../models/match.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_match')
        .setDescription('Use this command to create a match')
        .addIntegerOption((option) =>
            option.setName('match_id').setDescription('The ID of the match').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('team1').setDescription('The name of the first team').setRequired(true)
        )
        .addStringOption((option) =>
            option.setName('team2').setDescription('The name of the second team').setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('date')
                .setDescription('The date of the match. MM/DD format')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('time')
                .setDescription('The time of the match. HH:MM format')
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        // TODO: deal with date input stuff

        // None of the objects can be null because they are required in the slash command
        const date: string[] = interaction.options.getString('date')!.split('/');
        const month: number = parseInt(date[0]);
        const day: number = parseInt(date[1]);
        const time: string[] = interaction.options.getString('time')!.split(':');
        const hour: number = parseInt(time[0]);
        const minute: number = parseInt(time[1]);

        const matchTime = DateTime.fromObject(
            { month: month, day: day, hour: hour, minute: minute },
            { zone: 'utc' }
        );
        const match = new Match({
            _id: interaction.options.getInteger('match_id'),
            team1: interaction.options.getString('team1'),
            team2: interaction.options.getString('team2'),
            time: matchTime
        });

        await match.save();
        await interaction.reply(
            `Match between ${interaction.options.getString('team1')} and ` +
                `${interaction.options.getString(
                    'team2'
                )} created for <t:${matchTime.toSeconds()}:R>`
        );
    }
};
