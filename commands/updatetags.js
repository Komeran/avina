let logger = require('winston');
let dbClient = require('../databaseClient.js');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class UpdateTags extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!updatetags`\n" +
            "Updates the tags infront of the nicknames of all users on the server. " +
            "This is an admin only command and will fail if non-admins of a server attempt to use it.";
    }

    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
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

        dbClient.getGuild(gid).then(function (guild) {
            let checkhoist = !!guild && !!guild.checkhoist;

            let updateCount = 0;
            let doneCount = 0;
            for(let m in message.guild.members.array()) {
                let newMember = message.guild.members.array()[m];
                let newTag = '';
                let pos = 0;

                newMember.roles.array().forEach(function (role) {
                    if ((!checkhoist || role.hoist) && role.position > pos) {
                        newTag = getTagForRole(role.id, newMember.guild.roles) || newTag;
                        pos = getTagForRole(role.id, newMember.guild.roles) ? role.position : pos;
                    }
                });

                let nickname = newMember.nickname;
                if (!nickname)
                    nickname = newMember.user.username;
                let memberTag = nickname.split(' ')[0].replace('[', '').replace(']', '');
                if(nickname.indexOf('[') !== 0) {
                    memberTag = "";
                }
                if (getRoleForTag(memberTag, newMember.guild.roles)) {
                    nickname = nickname.substring(memberTag === "" ? 0 : (memberTag.length+3), nickname.length);
                }

                if ("[" + memberTag.toUpperCase() + "]" === newTag || (memberTag === "" && newTag === "")) {
                    continue;
                }

                updateCount++;

                newMember.edit({
                    nick: newTag + ' ' + nickname
                }).then(function() {
                    doneCount++;
                    if(doneCount === updateCount) {
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
                        message.author.send("Done updating role tags! I had to update " + updateCount + " role tags! " + addText);
                        message.delete();
                    }
                }).catch(function (e) {
                    logger.warn(e.message);
                    updateCount--;
                    if(doneCount === updateCount) {
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
                        message.author.send("Done updating role tags! I had to update " + updateCount + " role tags! " + addText);
                        message.delete();
                    }
                });
            }
            if(updateCount === doneCount) {
                let addText = "";
                if (updateCount === 0) {
                    addText = "Seems like everything was already tidied up!";
                }
                message.author.send("Done updating role tags! I had to update " + updateCount + " role tags! " + addText);
                message.delete();
            }
        }).catch(errorFunc.bind(this, message));
    }
}

module.exports = UpdateTags;

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
        let tagCloserPos = r.name.indexOf(']');
        if(r.id === role && tagCloserPos && r.name.indexOf('[') === 0) {
            let roleTag = r.name.substring(1, tagCloserPos).toLowerCase();
            return "[" + roleTag.toUpperCase() + "]";
        }
    }
    return undefined;
}

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