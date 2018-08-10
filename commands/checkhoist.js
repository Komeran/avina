let logger = require('winston');
let guildSettings = require('../util/guildSettings.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("This command doesn't work in direct messages!");
            return;
        }

        if(!message.guild.member(message.author).permissions.has("ADMINISTRATOR")) {
            message.author.send("This is an admin only command! And unfortunately you are no admin, sorry!");
            return;
        }

        let gid = message.guild.id;

        if(!guildSettings[gid]) {
            guildSettings[gid] = {
                checkhoist: true
            }
        }
        else {
            guildSettings[gid].checkhoist = !guildSettings[gid].checkhoist;
        }

        message.author.send("Guild settings updated! `Checkhoist` is now " + (guildSettings[gid].checkhoist? "active" : "inactive") + ". That means, when updating role tags of user nicknames, I will " + (guildSettings[gid].checkhoist? "ignore" : "include") + " all roles that don't have the `Display role members separately from members` setting enabled.");
    },
    help: "Usage: `!checkhoist`\n" +
        "This enables/disables whether I will ignore roles with the `Display role members separately from members` setting disabled when updating role tags. " +
        "This is an admin only command and will fail if non-admins of a server attempt to use it."
};