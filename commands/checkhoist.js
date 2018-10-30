let logger = require('winston');
let guildSettings = require('../util/guildSettings.js');
let dbClient = require('../databaseClient.js');
const Guild = require('../databaseClient.js').Guild;

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

        let guild = dbClient.getGuild(gid);

        if(!guild) {
            guild = new Guild(gid, true);
        }
        else {
            guild.checkhoist = !guild.checkhoist;
        }

        dbClient.addGuilds(guild);

        let newGuild = dbClient.getGuild(gid);

        if(!newGuild || newGuild.checkhoist !== guild.checkhoist) {
            message.author.send("Sorry, but something went wrong. The Guild Settings were not updated. If this keeps happening, please tell your admin!");
            return;
        }
        message.author.send("Guild settings updated! `Checkhoist` is now " + (newGuild.checkhoist? "active" : "inactive") + ". That means, when updating role tags of user nicknames, I will " + (newGuild.checkhoist? "ignore" : "include") + " all roles that don't have the `Display role members separately from members` setting enabled.");
    },
    help: "Usage: `!checkhoist`\n" +
        "This enables/disables whether I will ignore roles with the `Display role members separately from members` setting disabled when updating role tags. " +
        "This is an admin only command and will fail if non-admins of a server attempt to use it."
};