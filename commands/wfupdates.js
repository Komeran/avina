/**
 * @author marcs
 * @date 11.08.2018
 */

let wfclient = require("../wfclient.js")();

module.exports = {
    execute: function (args, message) {
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

        if(wfclient.isSubbedToWfUpdates(message.guild.id, message.channel.id)) {
            wfclient.unsubWfUpdates(message.guild.id, message.channel.id);
            message.channel.send({
                embed: {
                    title: "I will no longer let this channel know when new Warframe versions are out!",
                    color: 3447003
                }
            });
            message.delete();
        }
        else {
            wfclient.subToWfUpdates(message.guild.id, message.channel.id);
            message.channel.send({
                embed: {
                    title: "I will now let this channel know when new Warframe versions are out!",
                    color: 3447003
                }
            });
            message.delete();
        }
    },
    help: "Usage: `!wfupdates`\n" +
        "Marks/Unmarks the text channel the command was used in for updates on new Warframe Versions. " +
        "Avina will send notifications to this channel when new Versions are out."
};