let dbClient = require('../databaseClient.js');
const Guild = require('../databaseClient.js').Guild;
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class CheckHoist extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!checkhoist`\n" +
            "This enables/disables whether I will ignore roles with the `Display role members separately from members` setting disabled when updating role tags. " +
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
            return;
        }

        if(!message.guild.member(message.author).permissions.has("ADMINISTRATOR")) {
            message.author.send("This is an admin only command! And unfortunately you are no admin, sorry!");
            return;
        }

        let gid = message.guild.id;

        dbClient.getGuild(gid).then(function(guild) {
            if(!guild) {
                guild = new Guild(gid, true);
            }
            else {
                guild.checkhoist = !guild.checkhoist;
            }

            dbClient.addGuilds(guild).then(function() {
                message.author.send("Guild settings updated! `Checkhoist` is now " + (guild.checkhoist? "active" : "inactive") + ". That means, when updating role tags of user nicknames, I will " + (guild.checkhoist? "ignore" : "include") + " all roles that don't have the `Display role members separately from members` setting enabled.");
            }).catch(errorFunc.bind(this, message));

        }).catch(errorFunc.bind(this, message));
    }
}

module.exports = CheckHoist;

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