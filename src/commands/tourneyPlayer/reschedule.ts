import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { DateTime } from 'luxon';
import { Match } from '../../models/match.js';

/**
 * Command for a team captain to reschedule their match. Double checks with the other captain to make sure that the reschedule is consensual
 */

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reschedule')
        .setDescription('Schedules a time for a match')
        .addIntegerOption((option) =>
            option
                .setName('match_id')
                .setDescription('ID of the Match')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('day')
                .setDescription('Day of Match')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('time')
                .setDescription('Time of match (in UTC and HH:MM)')
                .setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const matchID: number = interaction.options.getInteger('match_id')!;
        const currDate: DateTime = DateTime.utc();
        // TODO: error handling for incorrect input on time/support just HH time
        // TODO: Make sure that the proper team is rescheduling and other team potentially
        let month: number = currDate.month;
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
        const match = await Match.findOneAndUpdate(
            { _id: matchID },
            { time: matchTime },
        ).exec();
        
        if(!match) {
            await interaction.reply('Please make sure you inputted the correct ID');
        } else {
            await interaction.reply(`The match between ${match.team1} and ${match.team2} ` +
                `has been rescheduled to <t:${matchTime.toSeconds()}:R>`);
        }
    },
};
