let dbClient = require('../databaseClient.js');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class Apps extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!apps`\n" +
            "Lists all current applications for roles on this server. " +
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

        if(!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
            message.author.send("Only admins of a server may use the !apps command! And you are no admin, sorry :/");
            return;
        }

        let fields = [];

        let gid = message.guild.id;

        let apps = dbClient.getApplicationsByGuild(gid);

        let appsPerUser = {};
        apps.forEach(function(app) {
            if(message.mentions.length > 0 && !message.mentions.users.has(app.userSnowflake))
                return;
            if(!appsPerUser[app.userSnowflake]) {
                appsPerUser[app.userSnowflake] = [];
            }
            appsPerUser[app.userSnowflake].push(app.roleSnowflake);
        });
        for(let user in appsPerUser) {
            let roles = "";
            appsPerUser[user].forEach(function(role) {
                roles += getRoleNameById(role, message.guild.id) + ", ";
            });
            roles = roles.substring(0, roles.length-2);
            fields.push({
                name: message.guild.member(user).nickname,
                value: "Roles: " + roles
            });
        }

        message.author.send({
            embed: {
                title: "List of current role applications",
                fields: fields,
                color: 3447003
            }
        });
        message.delete();
    }
}

module.exports = Apps;

let getRoleNameById = function(roleId, guildId) {
    for(let role in message.guild.roles[guildId].array()) {
        if(message.guild.roles[guildId].array()[role].id === '' + roleId)
            return message.guild.roles[guildId].array()[role].name
    }
    return undefined;
};