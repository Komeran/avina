let dbClient = require('../databaseClient.js');
import {Application} from "../domain/Application";
import {BaseCommand} from "../util/BaseCommand";
import {Message} from "discord.js";

export class Apply extends BaseCommand {
    /**
     *
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            message.delete();
            return;
        }

        if(!args[1]) {
            message.author.send("You need to tell me what role you want to apply for! Just put the role's tag after the !apply command like this: `!apply ga`");
            message.delete();
            return;
        }

        if(message.guild.member(message.author).permissions.has("ADMINISTRATOR")) {
            message.author.send("Sorry, but I can't manage admins. You have to manage your roles and tags yourself.");
            message.delete();
            return;
        }

        if(args.length === 2) {

            let appliedRole = getRoleForTag(args[1], message.guild.roles);
            if(appliedRole) {
                appliedRole = appliedRole.id;
                if(message.guild.member(message.author).roles.has(appliedRole)) {
                    message.author.send("You already have that role! No need to apply for it :)");
                    message.delete();
                    return;
                }
                let gid = message.guild.id;
                dbClient.addApplications(new Application(gid, message.author.id, appliedRole));
                message.author.send('Your Application for ' + getRoleForTag(args[1], message.guild.roles).name + ' has been registered and will be reviewed by an admin shortly!');
            }
            else {
                message.author.send('Invalid role tag \''+args[1]+'\'. It has to be one of the Server\'s role tags. A tag is a text between \'[\' and \']\' and is between 2 and 4 characters long. It\'s case insensitive!');
            }
        }
        else if(args.length === 1) {
            message.author.send('\'apply\' command invalid: Missing Channel Tag parameter!');
        }
        else {
            message.author.send('\'apply\' command invalid: Too many parameters!');
        }
        message.delete();
    }

    /**
     *
     * @type {string}
     */
    help = "Usage: `!apply <Tag>` where `<Tag>` can be the tag of any role, e.g. `ga` for the role `[GA] Gamer`\n" +
        "Notes an application for a role on this server, if you don't already have the role."
}

function getRoleForTag(text, roles) {
    text = text.toLowerCase();
    for(let entry of roles) {
        let role = entry[1];
        let tagCloserPos = role.name.substring(3,5).indexOf(']');
        if(role.name.substring(0,1) === '[' && tagCloserPos !== -1) {
            let roleTag = role.name.substring(1,3+tagCloserPos).toLowerCase();
            if(text === roleTag) {
                return role;
            }
        }
    }
    return undefined;
}