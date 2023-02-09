import { SlashCommandBuilder } from 'discord.js';

module.exports = {
    data: new SlashCommandBuilder().setName('best_ref').setDescription('hi rety'),

    async execute(interaction) {
        await interaction.reply(
            `match in 15 invites in 10. please dm <@273663943652671489> in game if you haven't recieved your invite!`
        );
    }
};
