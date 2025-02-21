const { SlashCommandBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

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
        console.log(isUserInList);
        
        // if user is in the list
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
                console.log(userChoice);
                
                switch (userChoice.customId) {
                    case 'back':
                        await userChoice.update({ 
                            content: 'I will remind you to straighten your back every 30 minutes.',
                            components: [] });
                        
                        timers.setTimer(userId, userName, 'back', interaction.locale);
                        break;
                    case 'water':
                        await userChoice.update({ 
                            content: 'I will remind you to drink every 30 minutes.',
                            components: [] });
                        
                        timers.setTimer(userId, userName, 'water', interaction.locale);
                        break;
                    case 'both':
                        await userChoice.update({ 
                            content: 'I will remind you to straighten your back and drink every 30 minutes.',
                            components: [] });
                        
                        timers.setTimer(userId, userName, 'both', interaction.locale);
                        break;
                    case 'default':
                        break;
                }
            } catch (e) {
                console.log(e);
                
                await interaction.editReply({ 
                    content: 'Choice not received within 1 minute, cancelling',
                    components: [] 
                });
            }
        }
    },
};