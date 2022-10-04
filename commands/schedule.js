const { SlashCommandBuilder, time } = require('discord.js');
const { DateTime } = require('luxon')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule')
        .setDescription('Schedules a time for a match')
        .addStringOption(option =>
            option.setName('day')
                .setDescription('Day of Match')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Time of match (in UTC and HH:MM)')
                .setRequired(true)),
    async execute(interaction) {
        currDate = DateTime.utc()
        // TODO: see if i can make it so osu players can just put SAT or SUN.
        // TODO: error handling for incorrect input
        const year = currDate.year
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
        const matchTime = Math.trunc(DateTime.local(year, month, day, hour, minute,{ zone: "utc" }).toSeconds())
        await interaction.reply('current time: <t:' + matchTime + ':R>')
    },
}