let dbClient = require('../databaseClient.js');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class Disapprove extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!disapprove <mention(s)>` where `<mention(s)>` is one or several user mentions, e.g. `@AwesomeGuy @SuperDude`\n" +
            "Deletes all role applications of the mentioned users. " +
            "This is an admin only command and will fail if non-admins of a server attempt to use it.";
    }

    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            message.delete();
            return;
        }

        if(!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
            message.author.send("Only admins of a server may use the !disapprove command! And you are no admin, sorry :/");
            message.delete();
            return;
        }

        let gid = message.guild.id;

        if(args.length >= 2) {
            let appsToDelete = [];
            let handledMentions = 0;
            message.mentions.members.array().forEach(function(user) {
                dbClient.getApplications(user.id, gid).then(function(userApps) {
                    if(userApps && userApps.length > 0) {
                        appsToDelete.concat(userApps);
                        user.send(message.author.username + " has disapproved your role applications!");
                    }
                    handledMentions++;
                    if(handledMentions === message.mentions.members.array().length) {
                        dbClient.deleteApplications(...appsToDelete).then(function() {
                            message.author.send("User applications were successfully disapproved!");
                            message.delete();
                        }).catch(errorFunc.bind(this, message));
                    }
                }).catch(errorFunc.bind(this, message));
            });
        }
        else if(args.length === 1) {
            message.author.send('\'disapprove\' command invalid: Missing user parameter!');
            message.delete();
        }
    }
}

module.exports = Disapprove;

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