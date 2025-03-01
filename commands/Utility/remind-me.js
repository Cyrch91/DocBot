const { SlashCommandBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js");

const { timers } = require('../../src/domain/Timers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind-me')
        .setDescription('Set a timer to remind you to straigthen your back and/or drink water.'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const userName = interaction.user.username;
        const timersArray = timers.getTimers();
        const isUserInList = timersArray.some(timer => timer.userId === userId);
        
        if (isUserInList) {
            await interaction.reply({ 
                content: 'You are already on the list !\nYou can remove yourself from the list with the "stop" command.',
                flags: MessageFlags.Ephemeral 
            });
        } else {
            const back = new ButtonBuilder()
                .setCustomId('back')
                .setLabel('Back reminder')
                .setStyle(ButtonStyle.Primary)
            const water = new ButtonBuilder()
                .setCustomId('water')
                .setEmoji('💧')
                .setLabel('Drink reminder')
                .setStyle(ButtonStyle.Secondary)
            const both = new ButtonBuilder()
                .setCustomId('both')
                .setLabel('Both')
                .setStyle(ButtonStyle.Success)
            
            const row = new ActionRowBuilder()
                .addComponents(back, water, both);

            const response = await interaction.reply({
                content: 'What type of reminder do you want ?',
                components: [row],
                flags: MessageFlags.Ephemeral,
                withResponse: true,    
            });

            const collectorFilter = i => i.user.id === interaction.user.id;

            try {
                const userChoice = await response.resource.message.awaitMessageComponent({
                    filter: collectorFilter,
                    time: 60_000
                });
                const frequency = await frequencyChoice(userChoice, userChoice.customId);
                timers.setTimer(userId, userName, userChoice.customId, frequency);
            } catch (error) {
                console.log(error);
                
                await interaction.editReply({ 
                    content: 'Choice not received within 1 minute, cancelling',
                    components: [] 
                });
            }
        }
    },
};

async function frequencyChoice(interaction,type) {
    const frequency = new StringSelectMenuBuilder()
        .setCustomId('frequency')
        .setPlaceholder('Select the frequency at which you want to be reminded')
        .addOptions([
            new StringSelectMenuOptionBuilder()
                .setLabel('Every 15 minutes')
                .setValue('15')
                .setDescription('Every 15 minutes'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Every 30 minutes')
                .setValue('30')
                .setDescription('Every 30 minutes'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Every 45 minutes')
                .setValue('45')
                .setDescription('Every 45 minutes'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Every 60 minutes')
                .setValue('60')
                .setDescription('Every 60 minutes'),
        ]);
    const select = new ActionRowBuilder()
        .addComponents(frequency);
    
    const response = await interaction.update({
        content: 'Select the frequency at which you want to be reminded',
        components: [select],
        withResponse: true
    });
    
    const collectorFilter = i => i.user.id === interaction.user.id;

    try {
        const frequencyChoice = await response.resource.message.awaitMessageComponent({
            filter: collectorFilter,
            time: 60_000
        });
        console.log(frequencyChoice);
        
        switch (type) {
            case 'back':
                await frequencyChoice.update({ 
                    content: `I will remind you to straighten your back every ${frequencyChoice.values[0]} minutes.`,
                    components: [] 
                });
                break;

            case 'water':
                await frequencyChoice.update({ 
                    content: `I will remind you to drink every ${frequencyChoice.values[0]} minutes.`,
                    components: [] 
                });
                break;
            
            case 'both':
                await frequencyChoice.update({
                    content: `I will remind you to straighten your back and drink every ${frequencyChoice.values[0]} minutes.`,
                    components: []    
                });
                break;

            default:
                break;
        }
        return frequencyChoice.values[0];
    } catch (error) {
        console.log(error);
        await interaction.editReply({ 
            content: 'Choice not received within 1 minute, cancelling',
            components: [] 
        });
    }
}
