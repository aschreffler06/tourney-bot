import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { DateTime } from 'luxon';
import { Match } from '../../models/match.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('display_matches')
        .setDescription('Displays matches')
        .addBooleanOption((option) =>
            option
                .setName('show_past')
                .setDescription('True if you want to see past matches (Before current time')
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        let currTime: number = DateTime.utc().toMillis();

        // if we want to see past matches
        if (interaction.options.getBoolean('show_past')) {
            currTime = 0;
        }
        let output = 'Matches:\n';
        const matches = await Match.find({ time: { $gte: currTime } });
        // TODO: sort by date instead of id
        matches.forEach(function (match) {
            output += `Match ${match._id} between ${match.team1} and ${match.team2} : <t:${
                match.time / 1000
            }:R>\n`;
        });
        console.log(output);
        await interaction.reply(output);
    }
};
