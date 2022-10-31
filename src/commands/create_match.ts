import { ChatInputCommandInteraction } from 'discord.js';
import { DateTime } from 'luxon';
import  { Match } from '../models/match.js';

module.exports = {
    data: {
        name: 'create_match',
        description: 'Creates a match',
        options: [
            {
                name: 'match_id',
                description: 'The ID of the match',
                required: true,
            },
            {
                name: 'team1',
                description: 'Name of the first player/team',
                required: true,
            },
            {
                name: 'team2',
                description: 'Name of the second player/team',
                required: true,
            },
            {
                name: 'date',
                description: 'The date of the match. MM/DD format',
                required: true,
            },
            {
                name: 'time',
                description: 'The time of the match. HH:MM format',
                required: true,
            },
        ],
    },

    async execute(interaction: ChatInputCommandInteraction) {
        // TODO: deal with date input stuff

        const date: string[] = interaction.options.getString('date')!.split('/');
        const month: number = parseInt(date[0]);
        const day: number = parseInt(date[1]);
        const time: string[] = interaction.options.getString('time')!.split(':');
        const hour: number = parseInt(time[0]);
        const minute: number = parseInt(time[1]);

        const matchTime =  DateTime.fromObject(
                { month: month, day: day, hour: hour, minute: minute },
                { zone: 'utc' }
            );
        const match = new Match({
            _id: interaction.options.getInteger('match_id'),
            team1: interaction.options.getString('team1'),
            team2: interaction.options.getString('team2'),
            time: matchTime,
        });
        
        await match.save();
        await interaction.reply(
            `Match between ${interaction.options.getString('team1')} and ` +
                `${interaction.options.getString('team2')} created for <t:${ matchTime.toSeconds() }:R>`
        );
    },
};
