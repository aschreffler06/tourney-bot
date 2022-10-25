const { SlashCommandBuilder } = require('discord.js')
const { DateTime } = require('luxon')
const { Match } = require('../models/match.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('display_matches')
        .setDescription('Displays matches')
        .addBooleanOption(option => 
            option.setName('show_past')
                .setDescription('True if you want to see past matches (Before current time')),

    async execute(interaction) {
        var currTime = DateTime.utc()
        
        // if we want to see past matches
        if (interaction.options.getBoolean('show_past')) {
            currTime = 0
        }
        const matches = await Match.find({ time: { $gte: currTime } }).exec()
        var output = 'The upcoming matches are:\n'
        matches.forEach (match =>
            output += `Match ${match._id} between ${match.team1} and ${match.team2} : <t:${match.time / 1000}:R>\n`
        )
        await interaction.reply(output)
    }
}