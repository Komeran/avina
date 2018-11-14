/**
 * @author marc.schaefer
 * @date 14.11.2018
 */

let logger = require('winston');
const UpdateMemberListener = require("../util/continuous/base_listeners/UpdateMemberListener.js");
const GuildMember = require("discord.js").GuildMember;
let dbClient = require('../databaseClient.js');

class UpdateRoleTags extends UpdateMemberListener {
    /**
     * @override
     * @param oldMember {GuildMember}
     * @param newMember {GuildMember}
     */
    execute(oldMember, newMember) {
        let newTag = '';
        let pos = 0;

        let gid = newMember.guild.id;

        dbClient.getGuild(gid).then(function(guild) {
            let checkhoist = !!guild && !!guild.checkhoist;

            newMember.roles.array().forEach(function(role) {
                if((!checkhoist || role.hoist) && role.position > pos) {
                    newTag = getTagForRole(role.id, newMember.guild.roles) || newTag;
                    pos = getTagForRole(role.id, newMember.guild.roles) ? role.position : pos;
                }
            });

            let nickname = newMember.nickname;
            if(!nickname)
                nickname = oldMember.user.username;
            let memberTag = nickname.split(' ')[0].replace('[', '').replace(']', '');
            if(nickname.indexOf('[') !== 0) {
                memberTag = "";
            }
            if(getRoleForTag(memberTag, newMember.guild.roles)) {
                nickname = nickname.substring((memberTag === "" ? 0 : (memberTag.length+3)), nickname.length);
            }

            if(memberTag === newTag) {
                return;
            }

            newMember.edit({
                nick: newTag + ' ' + nickname
            }).catch(function(e) {
                logger.error(e.message);
            });
        }).catch(logger.error);
    }
}

module.exports = UpdateRoleTags;

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