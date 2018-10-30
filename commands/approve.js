let dbClient = require('../databaseClient.js');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class Approve extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!approve <mention(s)>` where `<mention(s)>` is one or several user mentions, e.g. `@AwesomeGuy @SuperDude`\n" +
            "Approves all role applications of the mentioned users. " +
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
            return;
        }

        if(!message.guild.member(message.author.id).hasPermission('ADMINISTRATOR')) {
            message.author.send("Only admins of a server may use the !approve command! And you are no admin, sorry :/");
            message.delete();
            return;
        }

        if(args.length >= 2) {
            message.mentions.members.array().forEach(function(user) {
                let gid = message.guild.id;
                let apps = dbClient.getApplications(user.id, gid);
                apps.forEach(function(app) {
                    let role = message.guild.roles.find('id', app.roleSnowflake);
                    if(role) {
                        user.addRole(role.id);
                    }
                });
                dbClient.deleteApplications(...apps);
                message.author.send("Applications of member " + user.nickname + " have been approved!");
            });
        }
        else if(args.length === 1) {
            message.author.send('\'apply\' command invalid: Missing Channel Tag parameter!');
        }
        else {
            message.author.send('\'apply\' command invalid: Too many parameters!');
        }
        message.delete();
    }
}

module.exports = Approve;