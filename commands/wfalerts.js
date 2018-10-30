/**
 * @author marcs
 * @date 11.08.2018
 */

let wfclient = require("../wfclient.js")();
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

        if(wfclient.isSubbedToAlerts(message.guild.id, message.channel.id)) {
            wfclient.unsubAlerts(message.guild.id, message.channel.id);
            message.channel.send({
                embed: {
                    title: "I will no longer let this channel know when new Warframe versions are out!",
                    color: 3447003
                }
            });
            message.delete();
        }
        else {
            wfclient.subToAlerts(message.guild.id, message.channel.id);
            message.channel.send({
                embed: {
                    title: "I will now let this channel know when new Warframe versions are out!",
                    color: 3447003
                }
            });
            message.delete();
        }
    }
}

module.exports = WFAlerts;