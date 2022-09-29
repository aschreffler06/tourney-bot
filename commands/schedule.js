const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('schedule')
        .setDescription('Schedules a time for a match'),
    async execute(interaction) {
        await interaction.reply('haha you thought')
    },
}