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
    },
    help: ""
};