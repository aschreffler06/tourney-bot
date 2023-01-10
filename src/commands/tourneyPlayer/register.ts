const { SlashCommandBuilder } = require('discord.js');
import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, ButtonStyle, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ModalActionRowComponentBuilder, ModalSubmitInteraction, Collector } from 'discord.js';

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
            );

        await interaction.reply({ content: 'Are you signing up as a team or as a free agent?', components: [teamOrFARow], ephemeral: true});

        const teamOrFACollector = interaction.channel!.createMessageComponentCollector({ time: 15000 })
        teamOrFACollector.on('collect', async teamOrFAInteraction => {
            if (teamOrFAInteraction.customId == 'team') {
                teamOrFAInteraction.deleteReply();

                // Create a modal for them to input their team name
                const inputTeamNameModal = new ModalBuilder()
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
                inputTeamNameModal.addComponents(teamNameActionRow);

                // Show modal and grab their input
                await teamOrFAInteraction.showModal(inputTeamNameModal);
                const teamNameSubmit = await interaction.awaitModalSubmit({ time: 100000 });
                console.log(teamNameSubmit.fields.getTextInputValue('teamNameInput'));

                if (teamNameSubmit) {
                    // Determine how many players they can sign up
                    // TODO: grab min team size and max team size to know how many people they Can sign up
                    const minSize = 2;
                    const maxSize = 4;

                    // Create the number of buttons for the options we have
                    // TODO: I'm pretty sure that you can only have 5 buttons so maybe add workaround for that
                    const teamSizeRow = new ActionRowBuilder<ButtonBuilder>()
                    for (let i = minSize; i <= maxSize; i++) {
                        let id: string = i.toString();
                        let label: string = i.toString();
                        teamSizeRow.addComponents(new ButtonBuilder().setCustomId(id).setLabel(label).setStyle(ButtonStyle.Primary))
                    }
                    
                    // Get number of players they are signing up
                    await teamNameSubmit.reply({ content: 'How many players are you signing up?', components: [teamSizeRow], ephemeral: true })
                    const teamNumCollector = interaction.channel!.createMessageComponentCollector({ time: 15000 })
                    teamNumCollector.on('collect', async teamNumInteraction => {
                        const numSignups = +teamNumInteraction.customId;
                        console.log('num sign ups is ' + numSignups);

                        for (let i = 1; i <= numSignups; i++) {
                            const inputPlayersModal = new ModalBuilder()
                                .setCustomId('player' + i)
                                .setTitle('Player ' + i);
            
                            const playerIdInput = new TextInputBuilder()
                                    .setCustomId('playerIdInput')
                                    .setLabel(`Input player ${i}'s id`)
                                    .setStyle(TextInputStyle.Short)
                                    .setMinLength(1)
                                    .setMaxLength(9)
                                    .setRequired(true);
            
                            const playerActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(playerIdInput);
                            inputPlayersModal.addComponents(playerActionRow);
            
                            // Show modal and grab their input
                            console.log('Showing modal number ' + i);
                            await teamNumInteraction.showModal(inputPlayersModal);
                            const playerSubmit = await interaction.awaitModalSubmit({ time: 100000 });
                            console.log(playerSubmit.fields.getTextInputValue('playerIdInput'));
                        }
                    })

                } else {
                    //TODO: error handling here
                }
                

            } else if (teamOrFAInteraction.customId == 'free_agent') {
                // grab timezone, comments, etc.
            }
        })

        teamOrFACollector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    },
};
