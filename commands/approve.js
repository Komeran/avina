var logger = require('winston');
var applications = require('../util/applications.js');

module.exports = function(args, message) {
    if(!message.guild.member(message.author.id).hasPermission('ADMINISTRATOR')) {
        message.author.send("Only admins of a server may use the !approve command! And you are no admin, sorry :/");
        return;
    }

    if(args.length >= 2) {
        message.mentions.members.every(function(user) {
            for(let a in applications) {
                if(applications[a].user === user.id) {
                    let newTag = '';
                    let pos = 0;
                    for(let r in applications[a].roles) {
                        let role = message.guild.roles.find('id', applications[a].roles[r]);
                        if(role && role.hoist && role.position > pos && getTagForRole(role.id, message.guild.roles)) {
                            user.addRole(role.id);
                            newTag = getTagForRole(role.id, message.guild.roles);
                            pos = role.position;
                        }
                    }
                    let nickname = user.nickname;
                    if(getRoleForTag(nickname.split(' ')[0].replace('[', '').replace(']', ''), message.guild.roles)) {
                        nickname = nickname.substring(5, nickname.length);
                    }
                    user.edit({
                        nick: newTag + ' ' + nickname
                    }).catch(function(e) {
                        logger.warn(e.message);
                    });
                    applications.splice(Number(a), 1);
                    break;
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
};

function getRoleForTag(text, roles) {
    text = text.toLowerCase();
    for(let entry of roles) {
        let role = entry[1];
        let tagCloserPos = role.name.substring(3,5).indexOf(']');
        if(role.name.substring(0,1) === '[' && tagCloserPos !== -1) {
            let roleTag = role.name.substring(0,3).toLowerCase();
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
        if(r.id === role) {
            return r.name.substring(0, 4);
        }
    }
    return undefined;
}