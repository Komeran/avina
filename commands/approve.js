var logger = require('winston');
var applications = require('../util/applications.js');

module.exports = function(args, message) {
    if(args.length === 2) {
        message.mentions.members.every(function(user) {
            for(let a in applications) {
                if(applications[a].user === user.id) {
                    user.addRole(applications[a].role);
                    let nickname = user.nickname;
                    if(getRoleForTag(nickname.split(' ')[0])) {
                        nickname = nickname.substring(4, nickname.length);
                    }
                    user.edit({
                        nick: getTagForRole(applications[a].role) + ' ' + nickname
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
        var role = entry[1];
        var tagCloserPos = role.name.substring(3,5).indexOf(']');
        if(role.name.substring(0,1) === '[' && tagCloserPos !== -1) {
            logger.info('tagged role: '+role.name);
            var roleTag = role.name.substring(0,3).toLowerCase();
            if(text === roleTag) {
                logger.info('Given tag matches this one!');
                return role.id;
            }
        }
    }
    return undefined;
}

function getTagForRole(role, roles) {
    for(let entry of roles) {
        var r = entry[1];
        if(r.id === role) {
            return r.name.substring(0, 3);
        }
    }
    return undefined;
}