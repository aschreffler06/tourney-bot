const { SlashCommandBuilder } = require('discord.js');
const { DateTime } = require('luxon')
const { Match } = require('../models/match.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reschedule')
        .setDescription('Schedules a time for a match')
        .addIntegerOption(option =>
            option.setName('match_id')
                .setDescription('ID of the Match')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('day')
                .setDescription('Day of Match')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time of match (in UTC and HH:MM)')
                .setRequired(true)),

    async execute(interaction) {
        matchID = interaction.options.getInteger('match_id')
        currDate = DateTime.utc()
        // TODO: see if i can make it so osu players can just put SAT or SUN.
        // TODO: error handling for incorrect input on time/support just HH time
        month = currDate.month
        const day = parseInt(interaction.options.getString('day'))
        // This assumes that the player is scheduling for the next month
        if (day < currDate.day) {
            month += 1
            month %= 12
        }
        const time = (interaction.options.getString('time')).split(':')
        // We can assume that they entered HH:MM
        const hour = parseInt(time[0])
        const minute = parseInt(time[1])
        const matchTime = Math.trunc(DateTime.fromObject({ month: month, day: day, hour: hour, minute: minute } , { zone: "utc" }))
        
        // mongoDB and js store Dates as milliseconds
        const match = await Match.findOneAndUpdate({ _id: matchID }, { time: matchTime })

        await match.save()

        // We have the divided by 1000 because discord's timestamp uses seconds instead of milliseconds
        await interaction.reply(`The match between ${match.team1} and ${match.team2} ` +
            `has been rescheduled to <t:${matchTime / 1000}:R>`)
    },
}