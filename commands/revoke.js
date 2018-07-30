var logger = require('winston');

module.exports = {
    execute: function(args, message) {
        if(!message.guild.member(message.author.id).hasPermission('ADMINISTRATOR')) {
            message.author.send("Only admins of a server may use the !approve command! And you are no admin, sorry :/");
            message.delete();
            return;
        }

        if(args.length >= 3) {

            let rolesToRevoke = [];
            let reason = "";
            for(let i = 2; i < args.length; i++) {
                if(args[i].toLowerCase() === "reason:") {
                    // That means, the rest of the command is the reason for revoking the roles!
                    for(let j = i+1; j < args.length; j++) {
                        reason += args[j] + " ";
                    }
                    reason = reason.substring(0, reason.length-1);
                    break;
                }
                if(!getRoleForTag(args[i], message.guild.roles)) {
                    message.author.send("There is no role with tag [" + args[2].toUpperCase() + "] on this server, so I won't revoke it, sorry :(");
                    continue;
                }
                rolesToRevoke.push(getRoleForTag(args[i], message.guild.roles));
            }

            let user = message.mentions.members.array()[0];
            user.removeRoles(rolesToRevoke, reason);
        }
        else if(args.length === 2) {
            message.author.send('\'apply\' command invalid: Missing Role Tag parameter(s)!');
        }
        else if(args.length === 1) {
            message.author.send('\'apply\' command invalid: Missing User parameter!');
        }
        else {
            message.author.send('\'apply\' command invalid: Too many parameters!');
        }
        message.delete();
    },
    help: "Usage: `!revoke <mention> <role(s)> [reason: <reason>]` where `<mention>` is the user that gets revoked, `<role(s)>` are the roles to revoke and `<reason>` is the (optional) reason for revoking the roles.\n" +
        "Removes the provided role(s) from the mentioned user and provides the user with a reason if provided."
};

function getRoleForTag(text, roles) {
    text = text.toLowerCase();
    for(let entry of roles) {
        var role = entry[1];
        var tagCloserPos = role.name.substring(3,5).indexOf(']');
        if(role.name.substring(0,1) === '[' && tagCloserPos !== -1) {
            var roleTag = role.name.substring(1,3+tagCloserPos).toLowerCase();
            if(text === roleTag) {
                return role.id;
            }
        }
    }
    return undefined;
}