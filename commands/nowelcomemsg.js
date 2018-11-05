/**
 * @author marc.schaefer
 * @date 08.08.2018
 */

let logger = require('winston');
let dbClient = require('../databaseClient.js');
let TextChannel = require('../databaseClient.js').TextChannel;
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class NoWelcomeMessage extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!nowelcomemsg`\n" +
            "Tells Avina to stop sending any welcome messages in the channel, this command was used in. " +
            "This message will be sent when a user joins the server, along with a preceding mention of said user. " +
            "This is an admin only command and will fail if non-admins of a server attempt to use it.";
    }

    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
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

        let gid = message.guild.id;

        dbClient.getTextChannel(message.channel.id).then(function(textChannel) {
            textChannel = textChannel || TextChannel.getDefault(message.channel.id, gid);
            textChannel.welcomeMessage = null;

            dbClient.addTextChannels(false, textChannel).then(function() {
                message.channel.send("The welcome message of this channel has been removed!");
                message.delete();
            }).catch(errorFunc.bind(this, message));
        }).catch(errorFunc.bind(this, message));
    }
}

module.exports = NoWelcomeMessage;

/**
 * Relays an error message to the default error output and tells the user to consult admins.
 * @param [message] {Message}
 * @param error {Error}
 */
function errorFunc(message, error) {
    logger.error(error);
    if(message) {
        message.author.send("Sorry, but something went wrong. If this keeps happening, please tell your admin!");
        message.delete();
    }
}