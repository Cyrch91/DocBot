const { SlashCommandBuilder, ButtonBuilder, MessageFlags, ButtonStyle, ActionRowBuilder } = require('discord.js');
const usersList = require("../../src/domain/UsersToRemind");
const timersObject = require('../../src/domain/Timers');
const timers = timersObject.getInstance();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the reminder.'),
    async execute(interaction) {
        const userName = interaction.user.username;
        const usersToRemind = usersList.getInstance();
        console.log(usersToRemind);
        console.log(timers);
        
        if (!usersToRemind.back.includes(userName) || !usersToRemind.water.includes(userName)) {
            await interaction.reply({ 
                content: 'You have not subscribe to the list yet, please use the "remind-me" command first.',
                flags: MessageFlags.Ephemeral 
            });
        } else {
            if (userName in timers.timers) {
                // Let the user choose between staying in the list or get out of it
                const confirm = new ButtonBuilder()
                    .setCustomId('confirm')
                    .setLabel('Yes')
                    .setStyle(ButtonStyle.Success)
                const cancel = new ButtonBuilder()
                    .setCustomId('cancel')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger)
                
                const row = new ActionRowBuilder()
                    .addComponents(confirm, cancel);

                const response = await interaction.reply({ 
                    content: 'Would you like to be removed from the list ?',
                    flags: MessageFlags.Ephemeral,
                    components: [row],
                    withResponse: true
                });

                const collectorFilter = i => i.user.id === interaction.user.id;

                try {
                    const userStayInListChoice = await response.resource.message.awaitMessageComponent({
                        filter: collectorFilter,
                        time: 60_000
                    })

                    if (userStayInListChoice.customId === 'confirm') {
                        timers.cancelTimer(userName);
                        usersToRemind.back = usersToRemind.back.filter(user => user !== userName);
                        usersToRemind.water = usersToRemind.water.filter(user => user !== userName);

                        await userStayInListChoice.update({
                            content: 'You have been removed from the list.',
                            flags: MessageFlags.Ephemeral,
                            components: []
                        });
                    } else if(userStayInListChoice.customId === 'cancel') {
                        await userStayInListChoice.update({
                            content: 'You are still in the list.',
                            flags: MessageFlags.Ephemeral,
                            components: []
                        });
                    }
                    console.log(usersToRemind);
                    
                } catch (error) {
                    console.log(error);
                    await interaction.editReply({ 
                        content: 'An error occured or you did not answer in time. Please try again.',
                        components: [] 
                    });
                    return;
                }
            }
        }
    },
}