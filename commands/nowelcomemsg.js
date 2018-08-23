/**
 * @author marc.schaefer
 * @date 08.08.2018
 */

let guildSettings = require('../util/guildSettings.js');
let dbClient = require('../databaseClient.js');

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

        let guild = dbClient.getGuild(gid);

        let

        if(guildSettings[gid] && guildSettings[gid].welcomeMsgs) {
            if(guildSettings[gid].welcomeMsgs[message.channel.id]) {
                guildSettings[gid].welcomeMsgs.remove(message.channel.id);
                message.channel.send("The welcome message of this channel has been removed!");
                message.delete();
                return;
            }
            message.author.send("There was no welcome message set up for channel " + message.channel.name + ".");
            message.delete();
        }
    },
    help: "Usage: `!nowelcomemsg`\n" +
        "Tells Avina to stop sending any welcome messages in the channel, this command was used in. " +
        "This message will be sent when a user joins the server, along with a preceding mention of said user. " +
        "This is an admin only command and will fail if non-admins of a server attempt to use it."
};