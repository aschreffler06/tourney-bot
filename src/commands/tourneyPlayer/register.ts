const { SlashCommandBuilder } = require('discord.js');
import {
    ActionRowBuilder,
    ButtonBuilder,
    ChatInputCommandInteraction,
    ButtonStyle,
    Events,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ModalActionRowComponentBuilder,
    ModalSubmitInteraction,
    Collector,
    EmbedBuilder,
    ComponentType,
    ButtonInteraction,
    ActionRow,
    Message,
    time,
} from 'discord.js';

import { CollectorUtils } from 'discord.js-collector-utils';

module.exports = {
    data: new SlashCommandBuilder().setName('register').setDescription('Register for the tournament'),

    async execute(interaction: ChatInputCommandInteraction) {
        // TODO: logic to determine if this tourney is team/1v1 (max team size). Also add special case for draft
        // TODO: make expires ephemeral

        await interaction.reply({
            content: 'You will now be walked through the registration process',
            ephemeral: true,
        });
        // Take what format they want to register as
        let formatPrompt = await interaction.followUp({
            content: 'Are you registering as a team or as a free agent?',
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            customId: 'team',
                            label: 'Team',
                            style: ButtonStyle.Primary,
                        },
                        {
                            type: ComponentType.Button,
                            customId: 'freeAgent',
                            label: 'Free Agent',
                            style: ButtonStyle.Primary,
                        },
                    ],
                },
            ],
            ephemeral: true,
        });

        let formatResult = await CollectorUtils.collectByButton(
            formatPrompt,
            // Retrieve Result
            async (buttonInteraction) => {
                switch (buttonInteraction.customId) {
                    case 'team':
                        return { intr: buttonInteraction, value: 'Team' };
                    case 'freeAgent':
                        return { intr: buttonInteraction, value: 'Free Agent' };
                    default:
                        return;
                }
            },
            // Options
            {
                time: 10000,
                reset: true,
                target: interaction.user,
                stopFilter: (message) => message.content.toLowerCase() === 'stop',
                onExpire: async () => {
                    await interaction.channel!.send({ content: 'Too slow! Try being more decisive next time.' });
                },
            }
        );

        if (formatResult === undefined) {
            return;
        }

        // Based on format, take team info or free agent info
        switch (formatResult.value) {
            case 'Team':
                // Build a modal to take team info (team name and timezone)
                await formatResult.intr.reply({ content: 'You have selected team', ephemeral: true });

                let teamInfoPrompt = await formatResult.intr.followUp({
                    content: 'Please input your team information.',
                    components: [
                        {
                            type: ComponentType.ActionRow,
                            components: [
                                {
                                    type: ComponentType.Button,
                                    customId: 'enter_response',
                                    emoji: '⌨️',
                                    label: 'Enter Response',
                                    style: ButtonStyle.Primary,
                                },
                            ],
                        },
                    ],
                    ephemeral: true,
                });

                let teamInfoResult = await CollectorUtils.collectByModal(
                    teamInfoPrompt,
                    // Retrieve Result
                    new ModalBuilder({
                        customId: 'teamInfoModal',
                        title: 'Team Information',
                        components: [
                            {
                                type: ComponentType.ActionRow,
                                components: [
                                    {
                                        type: ComponentType.TextInput,
                                        customId: 'teamName',
                                        label: 'Team Name',
                                        style: TextInputStyle.Short,
                                        required: true,
                                    },
                                ],
                            },
                            {
                                type: ComponentType.ActionRow,
                                components: [
                                    {
                                        type: ComponentType.TextInput,
                                        customId: 'timezone',
                                        label: 'Timezone',
                                        style: TextInputStyle.Short,
                                        required: true,
                                    },
                                ],
                            },
                        ],
                    }),

                    async (modalSubmitInteraction) => {
                        let teamName = modalSubmitInteraction.components[0].components[0];
                        let timezone = modalSubmitInteraction.components[1].components[0];
                        if (teamName.type !== ComponentType.TextInput || timezone.type !== ComponentType.TextInput) {
                            return;
                        }
                        // TODO: logic for determining validity of team name / timezone
                        return {
                            intr: modalSubmitInteraction,
                            value: { teamName: teamName.value, timezone: timezone.value },
                        };
                    },
                    // Options
                    {
                        time: 10000,
                        reset: true,
                        target: interaction.user,
                        stopFilter: (message) => message.content.toLowerCase() === 'stop',
                        onExpire: async () => {
                            await interaction.channel!.send('Too slow! Try being more decisive next time.');
                        },
                    }
                );
                if (teamInfoResult == undefined) {
                    return;
                }

                await teamInfoResult.intr.reply({
                    content: ` Your team name is ${teamInfoResult.value.teamName} and your time zone is ${teamInfoResult.value.timezone}`,
                    ephemeral: true,
                });
            case 'Free Agent':
                return;
            default:
                return;
        }
    },
};
