const { SlashCommandBuilder } = require('discord.js');
import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, ButtonStyle, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder, ModalSubmitInteraction, Collector, EmbedBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register for the tournament'),
    
    async execute(interaction: ChatInputCommandInteraction) {
        // TODO: logic to determine if this tourney is team/1v1 (max team size). Also add special case for draft

        // Logic for team tournaments

        const teamOrFARow = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('team')
                    .setLabel('Team')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('free_agent')
                    .setLabel('Free Agent')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('solo')
                    .setLabel('Solo Tournament')
                    .setStyle(ButtonStyle.Primary),
            );

        await interaction.reply({ content: 'Are you signing up as a team, as a free agent, or for a solo tournament?', components: [teamOrFARow], ephemeral: true});

        const teamOrFACollector = interaction.channel!.createMessageComponentCollector({ time: 15000 })
        teamOrFACollector.on('collect', async teamOrFAInteraction => {
            if (teamOrFAInteraction.customId == 'team') {
                // Create a modal for discord that has a text input for team name and timezone
                const teamInfoModal = new ModalBuilder()
                    .setCustomId('team_info')
                    .setTitle('Initial Team Information')

                const teamNameInput = new TextInputBuilder()
                    .setCustomId('team_name')
                    .setPlaceholder('Team Name')
                    .setStyle(TextInputStyle.Short)
                    .setLabel('Team Name');
                const timezoneInput = new TextInputBuilder()
                    .setCustomId('timezone')
                    .setPlaceholder('In UTC-/+ format')
                    .setStyle(TextInputStyle.Short)
                    .setLabel('Timezone');

                const teamNameRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(teamNameInput);
                const timezoneRow = new ActionRowBuilder<ModalActionRowComponentBuilder>()
                    .addComponents(timezoneInput);

                teamInfoModal.addComponents(teamNameRow, timezoneRow);

                await teamOrFAInteraction.showModal(teamInfoModal);

            } else if (teamOrFAInteraction.customId == 'free_agent') {
                // grab timezone, comments, etc.
            } else if (teamOrFAInteraction.customId == 'solo') {
                // put in DB then done.
            }
        })

        teamOrFACollector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    },
};