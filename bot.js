let Discord = require('discord.js');
let logger = require('winston');
let auth = require('./auth.json');
let config = require('./config.json');
let reactTo = require('./util/reactTo.js');
let dbClient = require('./databaseClient.js');

// Fall back to default config if there is no config
if(!config) {
    config = {
        "logger": {
            "console": {
                "level": "info",
                "colorize": true
            },
            "files": []
        },
        "saving": {
            "path": "data"
        }
    }
}

// Setup Discord client
let client = new Discord.Client();

// Initialize Warframe Client
let wfClient = require("./wfclient.js")(client);

// Configure logger settings
logger.clear();
logger.add(new logger.transports.Console({
    colorize: config.logger.console.colorize,
    level: config.logger.console.level,
    format: logger.format.combine(
        logger.format.colorize(),
        logger.format.timestamp(),
        logger.format.printf(info => {
            return `${info.timestamp} ${info.level}: ${info.message}`;
        })
    )
}));
for(let f in config.logger.files) {
    logger.add(new logger.transports.File({
        filename: config.logger.files[f].path,
        level: config.logger.files[f].level,
        format: logger.format.combine(
            logger.format.timestamp(),
            logger.format.printf(info => {
                return `${info.timestamp} ${info.level}: ${info.message}`;
            })
        )
    }));
}

//Load commands
var commands = require('./util/commands.js');
// End Load commands

client.on('ready', () => {
	logger.info('I am ready!');
});

client.on('message', message => {
    dbClient.getTextChannel(message.channel.id).then(function(textChannel) {
        let isIgnored = !!textChannel && !!textChannel.ignoreCommands;

        if (message.content.substring(0,1) === '!') {
            let args = message.content.substring(1).split(' ');
            let cmd = args[0].toLowerCase();
            if(commands.cmds[cmd] && (cmd === "ignore" || !isIgnored)) {
                try {
                    commands.callCommand(cmd, message, args);
                }
                catch(e) {
                    logger.error(e);
                }
            }
            return;
        }
        if(!message.guild && message.author.id !== client.user.id) {
            reactTo(message, client.user.id);
            return;
        }
        if(message.author.id === client.user.id || isIgnored)
            return;
        for(let user of message.mentions.users) {
            if(user[0] === client.user.id) {
                reactTo(message, client.user.id);
                return;
            }
        }
    }).catch(logger.error);
});

client.on('guildMemberUpdate', function(oldMember, newMember) {
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
});

client.on('guildMemberAdd', function(member) {
    let gid = member.guild.id;

    dbClient.getWelcomeTextChannelsByGuild(gid).then(function(channels) {
        channels = channels || [];
        let channelsToDelete = [];
        for(let channel of channels) {
            let discordChannel = member.guild.channels.get(channel.snowflake);
            if(!discordChannel) {
                channelsToDelete.push(channel);
                continue;
            }
            discordChannel.send('<@' + member.id + '>, ' + channel.welcomeMessage);
        }
        if(channelsToDelete.length > 0)
            dbClient.deleteTextChannels(...channelsToDelete).catch(logger.error);
    }).catch(logger.error);
});

client.login(auth.token);
// End Setup Discord client

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