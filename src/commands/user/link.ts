import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Player } from '../../models/player';
import { getUserByName } from '../../controllers/osuController';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Link your osu account with your name')
        .addStringOption((option) =>
            option.setName('name').setDescription('Your osu! name').setRequired(true)
        ),

    async execute(interaction: ChatInputCommandInteraction) {
        const osuName = interaction.options.getString('name');
        // name is required in the command definition so we don't need to check for it but typescript is dumb
        if (!osuName) {
            return;
        }
        const osuUser = await getUserByName(osuName);
        const osuId = osuUser.data.id;
        if (osuUser) {
            // Check if they are already in the DB. No multiaccounting so we assume that they are relinking to a new discord and will only cover that specific case
            // This will also force an update to their rank and badge count
            const user = await Player.findById(osuId).exec();
            // Put in DB
            if (!user) {
                const player = new Player({
                    _id: osuId,
                    discord: interaction.user.id,
                    rank: osuUser.data.statistics.global_rank,
                    badges: osuUser.data.badges.length
                });
                await player.save();
                await interaction.reply('You have successfully linked your account!');
                // Update DB
            } else {
                user.updateOne({
                    discord: interaction.user.id,
                    rank: osuUser.data.statistics.global_rank,
                    badges: osuUser.data.badges.length
                }).exec();
                await user.save();
                await interaction.reply(
                    'Hopefully this link was used because you have a new discord account.'
                );
            }
        } else {
            await interaction.reply(
                'There was an error. Please check that your name is inputted correctly.'
            );
        }
        return;
    }
};
