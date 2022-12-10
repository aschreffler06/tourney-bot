const { SlashCommandBuilder } = require('discord.js');
import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, ButtonStyle, Events } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register for the tournament'),
    async execute(interaction: ChatInputCommandInteraction) {
        // TODO: logic to determine if this tourney is team/1v1 (max team size). Also add special case for draft
        
        const collector = interaction.channel?.createMessageComponentCollector({ time: 15000 })

        // Logic for team tournaments
        // const row = new ActionRowBuilder<ButtonBuilder>()
        //     .addComponents(
        //         new ButtonBuilder()
        //             .setCustomId('yes')
        //             .setLabel('Yes'),
        //         // new ButtonBuilder()
        //         //     .setCustomId('no')
        //         //     .setLabel('No')
        //     );
        const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('primary')
                .setLabel('Click me!')
                .setStyle(ButtonStyle.Primary),
        );

        await interaction.reply({ content: 'Button Test', components: [row], ephemeral: true});
        collector?.on('collect', i => console.log(i.customId));
    },
};
