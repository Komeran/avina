/**
 * @author marc.schaefer
 * @date 07.08.2018
 */

let logger = require('winston');
let dbClient = require('../databaseClient.js');
const Guild = require('../databaseClient.js').Guild;
const TextChannel = require('../databaseClient.js').TextChannel;
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class SetWelcomeMsg extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!setwelcomemsg <message>` where `<message>` can be really any text including mentions, emojis and Discord markup formatting.\n" +
            "Sets/updates the welcome message that Avina will send in a channel. " +
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

        let command = "!setwelcomemsg";
        let welcomeMsg = message.content.substring(command.length, message.content.length);
        logger.error(welcomeMsg);

        let gid = message.guild.id;

        dbClient.addGuilds(true, new Guild(gid, false)).then(function() {
            let cid = message.channel.id;

            dbClient.getTextChannel(cid).then(function(textChannel) {
                let isUpdate = false;

                if(!textChannel) {
                    textChannel = new TextChannel(cid, welcomeMsg, false, false, false, gid);
                }
                else {
                    textChannel.welcomeMessage = welcomeMsg;
                    isUpdate = true;
                }

                dbClient.addTextChannels(false, textChannel).then(function() {
                    message.channel.send("The welcome message of this channel has been " + (isUpdate? "updated" : "set") + "!");
                    message.delete();
                }).catch(errorFunc.bind(this, message));
            }).catch(errorFunc.bind(this, message));
        }).catch(errorFunc.bind(this, message));
    }
}

module.exports = SetWelcomeMsg;

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