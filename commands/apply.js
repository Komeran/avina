var logger = require('winston');
var applications = require('../util/applications.js');

module.exports = function(args, message) {
    if(args.length == 2) {
        var appliedRole = getRoleForTag(args[1], message.guild.roles);
        if(appliedRole) {
            let overridden = false;
            for(let a in applications) {
                if(applications[a].user === message.author.id) {
                    applications[a].role = appliedRole;
                    overridden = true;
                    break;
                }
            }
            if(!overridden) {
                applications.push({
                    user: message.author.id,
                    role: appliedRole
                });
            }
            message.reply('Your Application for <@&'+appliedRole+'> has been registered and will be reviewed by an <@&381140079298740224> or <@&381777629440638977> member shortly!');
        }
        else {
            message.author.send('Invalid role tag \''+args[1]+'\'. It has to be one of the Server\'s role tags. A tag is a text between \'[\' and \']\' and is between 2 and 4 characters long. It\'s case insensitive!');
        }
    }
    else if(args.length == 1) {
        logger.info('\'apply\' command invalid: Missing Channel Tag parameter!');
    }
    else {
        logger.info('\'apply\' command invalid: Too many parameters!');
    }
};

function getRoleForTag(text, roles) {
    text = text.toLowerCase();
    logger.info(text);
    for(let entry of roles) {
        var role = entry[1];
        var tagCloserPos = role.name.substring(3,5).indexOf(']');
        if(role.name.substring(0,1) == '[' && tagCloserPos != -1) {
            logger.info('tagged role: '+role.name);
            var roleTag = role.name.substring(1,3+tagCloserPos).toLowerCase();
            if(text == roleTag) {
                logger.info('Given tag matches this one!');
                return role.id;
            }
        }
    }
    return undefined;
}