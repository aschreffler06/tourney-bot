import { ChatInputCommandInteraction } from "discord.js";

const { SlashCommandBuilder } = require('discord.js');
const { DateTime } = require('luxon');
const { Match } = require('../models/match.js');

module.exports = {
    // data: new SlashCommandBuilder()
    //     .setName('create_match')
    //     .setDescription('Use this command to create a match')
    //     .addIntegerOption((option) =>
    //         option
    //             .setName('match_id')
    //             .setDescription('The ID of the match')
    //             .setRequired(true)
    //     )
    //     .addStringOption((option) =>
    //         option
    //             .setName('team1')
    //             .setDescription('The name of the first team')
    //             .setRequired(true)
    //     )
    //     .addStringOption((option) =>
    //         option
    //             .setName('team2')
    //             .setDescription('The name of the second team')
    //             .setRequired(true)
    //     )
    //     .addStringOption((option) =>
    //         option
    //             .setName('date')
    //             .setDescription('The date of the match. MM/DD format')
    //             .setRequired(true)
    //     )
    //     .addStringOption((option) =>
    //         option
    //             .setName('time')
    //             .setDescription('The time of the match. HH:MM format')
    //             .setRequired(true)
    //     ),
    data: {
        name: 'create_match',
        description: 'Creates a match',
        options: [
            {
                name: 'match_id',
                description: 'The ID of the match',
                required: true
            },
            {
                name: 'team1',
                description: 'Name of the first player/team',
                required: true
            },
            {
                name: 'team2',
                description: 'Name of the second player/team',
                required: true
            },
            {
                name: 'date',
                description: 'The date of the match. MM/DD format',
                required: true
            },
            {
                name: 'time',
                description: 'The time of the match. HH:MM format',
                required: true
            }
        ]
    },

    async execute(interaction: ChatInputCommandInteraction) {
        // TODO: deal with date input stuff

        const date = interaction.options.getString('date')!.split('/');
        const month = date[0];
        const day = date[1];
        const time = interaction.options.getString('time')!.split(':');
        const hour = time[0];
        const minute = time[1];

        const matchTime = Math.trunc(
            DateTime.fromObject(
                { month: month, day: day, hour: hour, minute: minute },
                { zone: 'utc' }
            )
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
                `${interaction.options.getString('team2')} created for <t:${
                    matchTime / 1000
                }:R>`
        );
    },
};
