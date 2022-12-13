const { SlashCommandBuilder } = require('discord.js');
import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, ButtonStyle, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder, ModalSubmitInteraction } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register for the tournament'),
    
    async execute(interaction: ChatInputCommandInteraction) {
        // TODO: logic to determine if this tourney is team/1v1 (max team size). Also add special case for draft
        
        const collector = interaction.channel!.createMessageComponentCollector({ time: 15000 })

        // Logic for team tournaments
        const teamOrFA = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('team')
                    .setLabel('Team')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('free_agent')
                    .setLabel('Free Agent')
                    .setStyle(ButtonStyle.Primary),
            );

        const inputTeamName = new ModalBuilder()
                .setCustomId('teamName')
                .setTitle('Team Name');

        const teamNameInput = new TextInputBuilder()
                .setCustomId('teamNameInput')
                .setLabel('What is your team name?')
                .setStyle(TextInputStyle.Short)
                .setMinLength(3)
                .setMaxLength(32)
                .setRequired(true);

        const teamNameActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(teamNameInput);
        inputTeamName.addComponents(teamNameActionRow);

        await interaction.reply({ content: 'Are you signing up as a team or as a free agent?', components: [teamOrFA], ephemeral: true});
        collector.on('collect', async teamOrFAInteraction => {
            if (teamOrFAInteraction.customId == 'team') {
                teamOrFAInteraction.deleteReply();
                await teamOrFAInteraction.showModal(inputTeamName);
                const submitted = await interaction.awaitModalSubmit({ time: 100000 });
                console.log(submitted.fields.getTextInputValue('teamNameInput'));
                if (submitted) {
                    await submitted.reply({ content: 'Your submission was received successfully!' });
                } //TODO: error handling here

                // grab min team size and max team size to know how many people they Can sign up
                // generate x amount of modals depending on their answer

            } else if (teamOrFAInteraction.customId == 'free_agent') {
                // grab timezone, comments, etc.
            }
        })

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    },
};
