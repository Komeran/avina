/**
 * @author marc.schaefer
 * @date 07.08.2018
 */

let dbClient = require('../databaseClient.js');
import {Guild, TextChannel} from '../databaseClient.js';

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

        dbClient.addGuilds(true, new Guild(gid, false));

        let cid = message.channel.id;

        let textChannel = dbClient.getTextChannel(cid);

        let isUpdate = false;

        if(!textChannel) {
            textChannel = new TextChannel(cid, welcomeMsg, false, false, false, gid);
        }
        else {
            textChannel.welcomeMessage = welcomeMsg;
            isUpdate = true;
        }

        dbClient.addTextChannels(textChannel);

        let newTextChannel = dbClient.getTextChannel(cid);

        if(!newTextChannel || newTextChannel.welcomeMessage !== welcomeMsg) {
            message.author.send("Sorry, but something went wrong. The Text Channel settings were not updated. If this keeps happening, please tell your admin!");
            return;
        }
        message.channel.send("The welcome message of this channel has been " + (isUpdate? "updated" : "set") + "!");
    },
    help: "Usage: `!setwelcomemsg <message>` where `<message>` can be really any text including mentions, emojis and Discord markup formatting.\n" +
        "Sets/updates the welcome message that Avina will send in a channel. " +
        "This message will be sent when a user joins the server, along with a preceding mention of said user. " +
        "This is an admin only command and will fail if non-admins of a server attempt to use it."
};