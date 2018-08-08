/**
 * @author marc.schaefer
 * @date 08.08.2018
 */

let guildSettings = require('../util/guildSettings.js');

module.exports = {
    execute: function (args, message) {
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

        if(!guildSettings[gid]) {
            guildSettings[gid] = {};
        }

        if(!guildSettings[gid].ignoredChannels) {
            guildSettings[gid].ignoredChannels = {};
        }

        let cid = message.channel.id;

        let ignored = guildSettings[gid].ignoredChannels[cid] = !guildSettings[gid].ignoredChannels[cid];

        message.channel.send({
            embed: {
                title: "This channel is now " + (ignored? "" : "no longer ") + "ignored.",
                description: "This means that I will " + (ignored? "" : "no longer ") + "ignore any commands people send in this channel, except the `!ignore` command.",
                color: 3447003
            }
        })
    },
    help: ""
};