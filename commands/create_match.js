const { SlashCommandBuilder } = require('discord.js');
const { DateTime } = require('luxon')
const { Match } = require('../models/match.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create_match')
        .setDescription('Use this command to create a match')
        .addIntegerOption(option =>
            option.setName('match_id')
                .setDescription('The ID of the match')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('team1')
                .setDescription('The name of the first team')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('team2')
                .setDescription('The name of the second team')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('date')
                .setDescription('The date of the match')
                .setRequired(true))
        .addStringOption(option =>
                    option.setName('time')
                        .setDescription('The time of the match. HH:MM format')
                        .setRequired(true)),

        async execute(interaction) {
            // TODO: deal with date input stuff
            const currDate = DateTime.utc()
            // TODO: figure out if im going to abstract out the date stuff or look more into luxon
            const year = currDate.year
            const matchTime = Math.trunc(DateTime.local(year, month, day, hour, minute, { zone: "utc" }))
            const match = new Match({ _id: interaction.options.getInteger('match_id'),
                                        team1: interaction.options.getString('team1'),
                                        team2: interaction.options.getString('team2'),
                                        time: matchTime})
        }
}