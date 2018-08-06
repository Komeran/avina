let logger = require('winston');
let guildSettings = require('../util/guildSettings.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("This command doesn't work in direct messages, sorry!");
            message.delete();
            return;
        }

        if(!message.guild.member(message.author).permissions.has("ADMINISTRATOR")) {
            message.author.send("This is an admin only command! It seems like you are no admin on this server, sorry!");
            message.delete();
            return;
        }

        let gid = message.guild.id;

        let updateCount = 0;
        for(let m in message.guild.members.array()) {
            let newMember = message.guild.members.array()[m];
            let newTag = '';
            let pos = 0;

            newMember.roles.array().forEach(function (role) {
                if ((!guildSettings[gid] || !guildSettings[gid].checkhoist || role.hoist) && role.position > pos) {
                    pos = role.position;
                    newTag = getTagForRole(role.id, newMember.guild.roles);
                }
            });

            let nickname = newMember.nickname;
            if (!nickname)
                nickname = newMember.user.username;
            let memberTag = nickname.split(' ')[0].replace('[', '').replace(']', '');
            if (getRoleForTag(memberTag, newMember.guild.roles)) {
                nickname = nickname.substring(5, nickname.length);
            }

            if (memberTag === newTag) {
                return;
            }

            updateCount++;

            newMember.edit({
                nick: newTag + ' ' + nickname
            }).catch(function (e) {
                logger.warn(e.message);
            });
        }

        let addText = "That's a lot. I'm glad I cleaned that mess up!";
        if(updateCount <= 50) {
            addText = " Quite a few actually!";
        }
        if(updateCount <= 10) {
            addText = "Not too many.";
        }
        if(updateCount === 0) {
            addText = "Seems like everything was already tidied up!";
        }

        message.channel.send("Done updating role tags! I had to update " + updateCount + " role tags! " + addText);
        message.delete();
    },
    help: ""
};

function getRoleForTag(text, roles) {
    text = text.toLowerCase();
    for(let entry of roles) {
        let role = entry[1];
        let tagCloserPos = role.name.substring(3,5).indexOf(']');
        if(role.name.substring(0,1) === '[' && tagCloserPos !== -1) {
            let roleTag = role.name.substring(1,3+tagCloserPos).toLowerCase();
            if(text === roleTag) {
                return role.id;
            }
        }
    }
    return undefined;
}

function getTagForRole(role, roles) {
    for(let entry of roles) {
        let r = entry[1];
        let tagCloserPos = r.name.substring(3,5).indexOf(']');
        if(r.id === role) {
            let roleTag = r.name.substring(1, 3+tagCloserPos).toLowerCase();
            return "[" + roleTag.toUpperCase() + "]";
        }
    }
    return undefined;
}