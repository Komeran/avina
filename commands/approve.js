var logger = require('winston');
var applications = require('../util/applications.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild.member(message.author.id).hasPermission('ADMINISTRATOR')) {
            message.author.send("Only admins of a server may use the !approve command! And you are no admin, sorry :/");
            message.delete();
            return;
        }

        if(args.length >= 2) {
            message.mentions.members.array().forEach(function(user) {
                for(let a in applications) {
                    if(applications[a].user === user.id) {
                        for(let r in applications[a].roles) {
                            let role = message.guild.roles.find('id', applications[a].roles[r]);
                            if(role) {
                                user.addRole(role.id);
                            }
                        }
                    }
                }
            });
        }
        else if(args.length === 1) {
            message.author.send('\'apply\' command invalid: Missing Channel Tag parameter!');
        }
        else {
            message.author.send('\'apply\' command invalid: Too many parameters!');
        }
        message.delete();
    },
    help: "Usage: `!approve <mention(s)>` where `<mention(s)>` is one or several user mentions, e.g. `@AwesomeGuy @SuperDude`\n" +
        "Approves all role applications of the mentioned users. " +
        "This is an admin only command and will fail if non-admins of a server attempt to use it."
};