import { ChatInputCommandInteraction } from 'discord.js';
import { DateTime } from 'luxon';
import { Match } from '../models/match.js';

module.exports = {
    data: {
        name: 'display_matches',
        description: 'Displays upcoming matches',
        options: [
            {
                name: 'show_past',
                description: 'True if you want to see past matches',
            },
        ],
    },

    async execute(interaction: ChatInputCommandInteraction) {
        var currTime: number = DateTime.utc().toSeconds();

        // if we want to see past matches
        if (interaction.options.getBoolean('show_past')) {
            currTime = 0;
        }
        const matches = await Match.find({ time: { $gte: currTime } }).exec();
        var output = 'The upcoming matches are:\n';
        matches.forEach(
            (match: typeof Match) =>
                (output += `Match ${match._id} between ${match.team1} and ${match.team2} : <t:${
                    match.time / 1000
                }:R>\n`)
        );
        await interaction.reply(output);
    },
};
