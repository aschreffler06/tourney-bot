import { SlashCommandBuilder } from 'discord.js';
import {
    ChatInputCommandInteraction,
    ButtonStyle,
    ModalBuilder,
    TextInputStyle,
    ComponentType
} from 'discord.js';

import { Team, Player } from '../../models/index';

import { CollectorUtils } from 'discord.js-collector-utils';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Register for the tournament'),

    async execute(interaction: ChatInputCommandInteraction) {
        // TODO: logic to determine if this tourney is team/1v1 (max team size). Also add special case for draft
        // TODO: make expires ephemeral

        // We assume that the captain has already linked their osu! account and it's in the database
        const captain = Player.findOne({ discord: interaction.user.id });

        // If the captain is not in the database, they need to link their osu! account
        if (!captain) {
            interaction.reply({
                content:
                    'You need to link your osu! account before you can register. Use the `/link` command to do so.',
                ephemeral: true
            });
            return;
        }

        await interaction.deferReply({ ephemeral: true });
        // Take what format they want to register as
        const formatPrompt = await interaction.followUp({
            content: 'Are you registering as a team or as a free agent?',
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            customId: 'team',
                            label: 'Team',
                            style: ButtonStyle.Primary
                        },
                        {
                            type: ComponentType.Button,
                            customId: 'freeAgent',
                            label: 'Free Agent',
                            style: ButtonStyle.Primary
                        }
                    ]
                }
            ],
            ephemeral: true
        });

        const formatResult = await CollectorUtils.collectByButton(
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
                    await interaction.channel?.send({
                        content: 'Too slow! Try being more decisive next time.'
                    });
                }
            }
        );

        if (formatResult === undefined) {
            return;
        }

        // Based on what they chose, take team info or free agent info
        switch (formatResult.value) {
            case 'Team': {
                // Build a modal to take team info (team name and timezone)

                await formatResult.intr.deferReply({ ephemeral: true });

                const teamInfoPrompt = await formatResult.intr.followUp({
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
                                    style: ButtonStyle.Primary
                                }
                            ]
                        }
                    ],
                    ephemeral: true
                });

                const teamInfoResult = await CollectorUtils.collectByModal(
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
                                        required: true
                                    }
                                ]
                            },
                            {
                                type: ComponentType.ActionRow,
                                components: [
                                    {
                                        type: ComponentType.TextInput,
                                        customId: 'timezone',
                                        label: 'Timezone',
                                        style: TextInputStyle.Short,
                                        required: true
                                    }
                                ]
                            }
                        ]
                    }),

                    async (modalSubmitInteraction) => {
                        const teamName = modalSubmitInteraction.components[0].components[0];
                        const timezone = modalSubmitInteraction.components[1].components[0];
                        if (
                            teamName.type !== ComponentType.TextInput ||
                            timezone.type !== ComponentType.TextInput
                        ) {
                            return;
                        }
                        // TODO: logic for determining validity of team name / timezone
                        return {
                            intr: modalSubmitInteraction,
                            value: { teamName: teamName.value, timezone: timezone.value }
                        };
                    },
                    // Options
                    {
                        time: 10000,
                        reset: true,
                        target: interaction.user,
                        stopFilter: (message) => message.content.toLowerCase() === 'stop',
                        onExpire: async () => {
                            await interaction.channel?.send(
                                'Too slow! Try being more decisive next time.'
                            );
                        }
                    }
                );

                if (teamInfoResult == undefined) {
                    return;
                }

                // TODO: Get the min and max values for team size here
                // hardcoded test values
                const minTeamSize = 2;
                const maxTeamSize = 4;

                // Build a modal to take team member info (osu! username) for each team member (minTeamSize to maxTeamSize)
                for (let i = minTeamSize; i < maxTeamSize; i++) {
                    return;
                }

                break;
            }
            case 'Free Agent': {
                break;
            }
            default: {
                return;
            }
        }
    }
};
