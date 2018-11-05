/**
 * @author marcs
 * @date 11.08.2018
 */

let wfclient = require("../wfclient.js")();
let dbclient = require("../databaseClient.js");
let logger = require('winston');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class WFAlerts extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!wfalerts`\n" +
            "Marks/Unmarks the text channel the command was used in for updates on Warframe Alert Missions. " +
            "Avina will send and update messages with infos on current Alert Missions every 30 seconds.";
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

        wfclient.constructor.isSubbedToAlerts(message.channel.id).then(function(isSubbed) {
            if(isSubbed) {
                dbclient.getAlertMessagesByTextChannel(message.channel.id).then(function(alertMessages) {
                    if(alertMessages && alertMessages.length > 0) {
                        for(let msg of alertMessages) {
                            message.channel.fetchMessage(msg.snowflake).then(am => am.delete()).catch();
                        }
                    }
                    wfclient.constructor.unsubAlerts(message.channel.id).then(function() {
                        try {
                            message.channel.send({
                                embed: {
                                    title: "I will no longer update this Channel about Warframe alerts!",
                                    color: 3447003
                                }
                            });
                            message.delete();
                        }
                        catch(e) {
                            message.author.send("I'm sorry but I don't have permission to do things in that channel... Please make sure I can send, read and manage messages, aswell as send links and attach files!");
                            logger.error(e);
                        }
                    }).catch(errorFunc.bind(this, message));
                }).catch(errorFunc.bind(this, message));
            }
            else {
                wfclient.constructor.subToAlerts(message.guild.id, message.channel.id).then(function() {
                    try {
                        message.channel.send({
                            embed: {
                                title: "I will now update this Channel about Warframe alerts!",
                                color: 3447003
                            }
                        });
                        message.delete();
                    }
                    catch(e) {
                        message.author.send("I'm sorry but I don't have permission to do things in that channel... Please make sure I can send, read and manage messages, aswell as send links and attach files!");
                        logger.error(e);
                    }
                }).catch(errorFunc.bind(this, message));
            }
        }).catch(errorFunc.bind(this, message));
    }
}

module.exports = WFAlerts;

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