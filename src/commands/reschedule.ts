import { ChatInputCommandInteraction } from 'discord.js';
import { DateTime } from 'luxon';
import { Match } from '../models/match.js';

module.exports = {
    data: {
        name: 'reschedule',
        description: 'Schedules a time for a match',
        options: [
            {
                name: 'match_id',
                description: 'ID of the match',
                required: true,
            },
            {
                name: 'day',
                description: 'Day of match (the number day)',
                required: true,
            },
            {
                name: 'time',
                description: 'Time of match (in UTC and HH:MM)',
                required: true,
            },
        ],
    },

    async execute(interaction: ChatInputCommandInteraction) {
        const matchID: number = interaction.options.getInteger('match_id')!;
        const currDate: DateTime = DateTime.utc();
        // TODO: see if i can make it so osu players can just put SAT or SUN.
        // TODO: error handling for incorrect input on time/support just HH time
        var month: number = currDate.month;
        const day: number = parseInt(interaction.options.getString('day')!);
        // This assumes that the player is scheduling for the next month
        if (day < currDate.day) {
            month += 1;
            month %= 12;
        }
        const time: string[] = interaction.options.getString('time')!.split(':');
        // We can assume that they entered HH:MM
        const hour: number = parseInt(time[0]);
        const minute: number = parseInt(time[1]);
        const matchTime: DateTime = DateTime.fromObject(
            { month: month, day: day, hour: hour, minute: minute },
            { zone: 'utc' }
        );

        // mongoDB and js store Dates as milliseconds
        const match: typeof Match = await Match.findOneAndUpdate(
            { _id: matchID },
            { time: matchTime }
        );

        await match.save();

        await interaction.reply(
            `The match between ${match.team1} and ${match.team2} ` +
                `has been rescheduled to <t:${matchTime.toSeconds()}:R>`
        );
    },
};
