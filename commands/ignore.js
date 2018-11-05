/**
 * @author marc.schaefer
 * @date 08.08.2018
 */

let dbClient = require('../databaseClient.js');
let TextChannel = require('../databaseClient.js').TextChannel;
let logger = require('winston');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class Ignore extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!ignore`\n" +
            "Marks/Unmarks a channel as 'ignored', meaning that Avina will ignore all commands and smalltalk attempts except the `!ignore` command. " +
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

        if(!message.guild.member(message.author).permissions.has('ADMINISTRATOR')) {
            message.author.send("This is an admin only command! You are no admin of this server, sorry!");
            message.delete();
            return;
        }

        let gid = message.guild.id;

        dbClient.getTextChannel(message.channel.id).then(function(textChannel) {
            textChannel = textChannel || TextChannel.getDefault(message.channel.id, gid);
            textChannel.ignoreCommands = !textChannel.ignoreCommands;

            dbClient.addTextChannels(false, textChannel).then(function() {
                message.channel.send({
                    embed: {
                        title: "This channel is now " + (textChannel.ignoreCommands? "" : "no longer ") + "ignored.",
                        description: "This means that I will " + (textChannel.ignoreCommands? "" : "no longer ") + "ignore any commands people send in this channel, except the `!ignore` command.",
                        color: 3447003
                    }
                });
                message.delete();
            }).catch(errorFunc.bind(this, message));
        }).catch(errorFunc.bind(this, message));
    }
}

module.exports = Ignore;

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