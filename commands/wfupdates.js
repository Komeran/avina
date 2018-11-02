/**
 * @author marcs
 * @date 11.08.2018
 */

let wfclient = require("../wfclient.js")();
let logger = require('winston');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class WFUpdates extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!wfupdates`\n" +
            "Marks/Unmarks the text channel the command was used in for updates on new Warframe Versions. " +
            "Avina will send notifications to this channel when new Versions are out.";
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

        wfclient.constructor.isSubbedToWfUpdates(message.channel.id).then(function(isSubbed) {
            if(isSubbed) {
                wfclient.constructor.unsubWfUpdates(message.channel.id).then(function() {
                    try {
                        message.channel.send({
                            embed: {
                                title: "I will no longer let this channel know when new Warframe versions are out!",
                                color: 3447003
                            }
                        });
                        message.delete();
                    }
                    catch(e) {
                        message.author.send("I'm sorry but I don't have permission to do things in that channel... Please make sure I can send, read and manage messages, aswell as send links and attach files!");
                        logger.error(e);
                    }
                });
            }
            else {
                wfclient.constructor.subToWfUpdates(message.guild.id, message.channel.id).then(function() {
                    try {
                        message.channel.send({
                            embed: {
                                title: "I will now let this channel know when new Warframe versions are out!",
                                color: 3447003
                            }
                        });
                        message.delete();
                    }
                    catch(e) {
                        message.author.send("I'm sorry but I don't have permission to do things in that channel... Please make sure I can send, read and manage messages, aswell as send links and attach files!");
                        logger.error(e);
                    }
                });
            }
        })
    }
}

module.exports = WFUpdates;