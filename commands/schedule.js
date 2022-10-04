const { SlashCommandBuilder, time } = require('discord.js');
const moment = require('moment')

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
                .setDescription('Time of match (in UTC)')
                .setRequired(true)),
    async execute(interaction) {
        const day = interaction.options.getString('day')
        const time = interaction.options.getString('time')
        // TODO: Need to deal with not wanting to have to put in the month. if the day listed is less than the current day, then we can assume that we go to next month
        const month = moment()
        await interaction.reply('Your match will be at ' + time + 'UTC, on month ' + day + ' yes this is definitely finished haha awesome')
    },
}