/**
 * @author marc.schaefer
 * @date 14.11.2018
 */

let logger = require('winston');
const JoinGuildListener = require("../util/continuous/base_listeners/JoinGuildListener.js");
const GuildMember = require("discord.js").GuildMember;
let dbClient = require('../databaseClient.js');

class SendWelcomeMessages extends JoinGuildListener {

    /**
     * @override
     * @param member {GuildMember}
     */
    execute(member) {
        let gid = member.guild.id;

        dbClient.getWelcomeTextChannelsByGuild(gid).then(function(channels) {
            channels = channels || [];
            let channelsToDelete = [];
            for(let channel of channels) {
                let discordChannel = member.guild.channels.get(channel.snowflake);
                if(!discordChannel) {
                    channelsToDelete.push(channel);
                    continue;
                }
                discordChannel.send('<@' + member.id + '>, ' + channel.welcomeMessage);
            }
            if(channelsToDelete.length > 0)
                dbClient.deleteTextChannels(...channelsToDelete).catch(logger.error);
        }).catch(logger.error);
    }
}

module.exports = SendWelcomeMessages;