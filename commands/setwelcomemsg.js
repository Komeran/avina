/**
 * @author marc.schaefer
 * @date 07.08.2018
 */

let logger = require('winston');
let guildSettings = require('../util/guildSettings.js');

module.exports = {
    execute: function(args, message) {
            if(!message.guild) {
                message.author.send("This command doesn't work in direct messages!");
                message.delete();
                return;
            }
            if(!message.guild.member(message.author).permissions.has("ADMINISTRATOR")) {
                message.author.send("This is and admin only command! And you are not an admin of this server, sorry!");
                message.delete();
                return;
            }

        let welcomeMsg = "";

        for(let i = 1; i < args.length; i++) {
            welcomeMsg += args[i] + ' ';
        }

        let gid = message.guild.id;

        if(!guildSettings[gid]) {
            guildSettings[gid] = {
                welcomeMsgs: {}
            };
            guildSettings[gid].welcomeMsgs[message.channel.id] = welcomeMsg;
        }
        else {
            if(!guildSettings[gid].welcomeMsgs) {
                guildSettings[gid].welcomeMsgs = {}
            }
            if(guildSettings[gid].welcomeMsgs[message.channel.id]) {
                guildSettings[gid].welcomeMsgs[message.channel.id] = welcomeMsg;
                message.channel.send("The welcome message of this channel has been updated!");
            }
            else {
                guildSettings[gid].welcomeMsgs[message.channel.id] = welcomeMsg;
                message.channel.send("The welcome message of this channel has been set!");
            }
        }
    },
    help: "Usage: `!setwelcomemsg <message>` where `<message>` can be really any text including mentions, emojis and Discord markup formatting.\n" +
        ""
};