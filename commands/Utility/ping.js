const { SlashCommandBuilder, MessageFlags } = require("discord.js");

const wait = require('node:timers/promises').setTimeout;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong !'),
    async execute(interaction) {
        // console.log(interaction);
        await interaction.reply({ content: 'Pong !', flags: MessageFlags.Ephemeral });
        await wait(2_000);
		await interaction.editReply('Pong again!');
    },
};