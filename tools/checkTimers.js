const { timers } = require('../src/domain/Timers');
const { PresenceUpdateStatus } = require('discord.js');

async function checkTimers(client) {
    const timersArray = timers.getTimers();
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit'}); // TODO : get current locale
    const userToRemind = timersArray.filter(timer => timer.nextReminderTime === time);
    
    for (const timer of userToRemind) {
        const user = await client.users.fetch(timer.userId);
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const guildManager = await guild.members.fetch(timer.userId);
        const userGuildStatus = guildManager.presence.status;
        
        switch (timer.type) {
            case 'back':
                try {
                    if (PresenceUpdateStatus.Online === userGuildStatus) {
                        await user.send('Remember to straighten your back !');
                        timers.cancelTimer(timer.userId);
                        timers.setTimer(timer.userId, timer.userName, 'back');
                    } else {
                        timers.cancelTimer(timer.userId);
                    }
                } catch (error) {
                    console.error(error);
                }
                break;

            case 'water':
                try {
                    if (PresenceUpdateStatus.Online === userGuildStatus) {
                        await user.send('Remember to drink water !');
                        timers.cancelTimer(timer.userId);
                        timers.setTimer(timer.userId, timer.userName, 'water');
                    } else {
                        timers.cancelTimer(timer.userId);
                    }
                } catch (error) {
                    console.error(error);
                }
                break;

            case 'both':
                try {
                    if (PresenceUpdateStatus.Online === userGuildStatus) {
                        await user.send('Remember to straighten your back and drink water !');
                        timers.cancelTimer(timer.userId);
                        timers.setTimer(timer.userId, timer.userName, 'both');
                    } else {
                        timers.cancelTimer(timer.userId);
                    }
                } catch (error) {
                    console.error(error);
                }
                break;
        
            default:
                break;
        }
    }
}

module.exports = { checkTimers };
