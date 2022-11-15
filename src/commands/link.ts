import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Player } from '../models/player';
const axios = require('axios');
const osu = require('../controllers/osuController');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your osu account with your name')
        .addStringOption((option) =>
            option
                .setName('name')
                .setDescription('Your osu! name')
                .setRequired(true)
        ),
    
    async execute(interaction: ChatInputCommandInteraction) {
        const osuName = interaction.options.getString('name');
        const osuUser = await osu.getUserByName(osuName!);
        const osuId = osuUser.data.id;
        if (osuUser) {
            // Check if they are already in the DB. No multiaccounting so we assume that they are relinking to a new discord and will only cover that specific case
            // This will also force an update to their rank and badge count
            const user = await Player.findById(osuId).exec()
            if(!user) {
                const player = new Player({
                    _id: osuId,
                    discord: interaction.user.id,
                    rank: osuUser.data.statistics.global_rank,
                    badges: osuUser.data.badges.length
                })
                await player.save();
                await interaction.reply('You have successfully linked your account!')
            } else {
                user.updateOne({
                    discord: interaction.user.id,
                    rank: osuUser.data.statistics.global_rank,
                    badges: osuUser.data.badges.length
                }).exec();
                await user.save();
                await interaction.reply('Hopefully this link was used because you have a new discord account.')
            }
        } else {
            
            await interaction.reply('There was an error. Please check that your name is inputted correctly.');
        }
    }
}