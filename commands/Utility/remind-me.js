const { SlashCommandBuilder, MessageFlags, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const usersList = require("../../src/domain/UsersToRemind");

const timersObject = require('../../src/domain/Timers');
const timers = timersObject.getInstance();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remind-me')
        .setDescription('Set a timer to remind you to straigthen your back and/or drink'),
    async execute(interaction) {
        const userName = interaction.user.username;
        const usersToRemind = usersList.getInstance();
        console.log(usersToRemind);
        
        // if user is in the list
        if (usersToRemind.back.includes(userName) || usersToRemind.water.includes(userName)){
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
                        usersToRemind.back.push(userName);
                        await userChoice.update({ 
                            content: 'I will remind you to straighten your back every 30 minutes.',
                            components: [] });
                        console.log(usersToRemind);

                        // Set a timer to remind the user every 30 minutes
                        const remindBack = async () => {
                            await interaction.user.send('Remember to straighten your back!');
                        };

                        timers.setTimer(userName, remindBack, 30 * 60 * 1000);
                        remindBack();
                        break;
                    case 'water':
                        usersToRemind.water.push(userName);
                        await userChoice.update({ 
                            content: 'I will remind you to drink every 30 minutes.',
                            components: [] });
                        console.log(usersToRemind);

                        const remindWater = async () => {
                            await interaction.user.send('Remember to drink some water !');
                        };
                        
                        timers.setTimer(userName, remindWater, 30 * 60 * 1000);
                        remindWater();
                        break;
                    case 'both':
                        usersToRemind.back.push(userName);
                        usersToRemind.water.push(userName);
                        await userChoice.update({ 
                            content: 'I will remind you to straighten your back and drink every 30 minutes.',
                            components: [] });
                        console.log(usersToRemind);

                        const remindBoth = async () => {
                            await interaction.user.send('Remember to straighten your back and drink some water !');
                        };
                        
                        timers.setTimer(userName, remindBoth, 30 * 60 * 1000);
                        remindBoth();
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