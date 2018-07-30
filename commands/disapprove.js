var logger = require('winston');
var applications = require('../util/applications.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        if(!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
            message.author.send("Only admins of a server may use the !disapprove command! And you are no admin, sorry :/");
            message.delete();
            return;
        }

        if(args.length >= 2) {
            message.mentions.members.array().forEach(function(user) {
                for(let a in applications) {
                    if(applications[a].user === user.id) {
                        user.send(message.author.username + " has disapproved your role applications!");
                        applications.splice(Number(a), 1);
                        return;
                    }
                }
            });
        }
        else if(args.length === 1) {
            message.author.send('\'disapprove\' command invalid: Missing user parameter!');
        }
        message.delete();
    },
    help: "Usage: `!disapprove <mention(s)>` where `<mention(s)>` is one or several user mentions, e.g. `@AwesomeGuy @SuperDude`\n" +
        "Deletes all role applications of the mentioned users. " +
        "This is an admin only command and will fail if non-admins of a server attempt to use it."
};