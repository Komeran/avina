var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var games = require('./dnd_util/games.js');
var fs = require("fs");
var path = require("path");
var config = require('./config.json');
let reactTo = require('./util/reactTo.js');
let guildSettings = require('./util/guildSettings.js');

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
var client = new Discord.Client();

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

// Load save data
logger.info("Loading save data...");

let guildSettingsPath = path.join(__dirname, config.saving.path,"guildSettings.json");
if(fs.existsSync(guildSettingsPath)) {
    let dataString = fs.readFileSync(guildSettingsPath);
    let data = JSON.parse(dataString);
    for(let gid in data) {
        guildSettings[gid] = data[gid];
        logger.debug("Settings of server " + gid + "loaded");
    }
    logger.info("Guild Settings save loaded.");
}
else {
    logger.info("No Guild Settings save found.");
}

let gamesPath = path.join(__dirname, config.saving.path,"games.json");
if(fs.existsSync(gamesPath)) {
    let dataString = fs.readFileSync(gamesPath);
    let data = JSON.parse(dataString);
    for(let gid in data) {
        games[gid] = data[gid];
	    logger.debug("Games of server " + gid + "loaded");
    }
    logger.info("Games save loaded.");
}
else {
	logger.info("No games save found.");
}
let applications = require('./util/applications.js');
let appsPath = path.join(__dirname, config.saving.path,"applications.json");
if(fs.existsSync(appsPath)) {
    let dataString = fs.readFileSync(appsPath);
    let apps = JSON.parse(dataString);
    for(let a in apps) {
        applications[a] = apps[a];
    }
    logger.info("Applications save loaded.");
}
else {
    logger.info("No applications save found.");
}
let alertMessages = null;
let wfPath = path.join(__dirname, config.saving.path,"warframe");
let alertMessagesPath = path.join(wfPath, "alertMessages.json");
if(fs.existsSync(alertMessagesPath)) {
    let dataString = fs.readFileSync(alertMessagesPath);
    alertMessages = JSON.parse(dataString);
    logger.info("Applications save loaded.");
}
else {
    logger.info("No applications save found.");
}
let wfClient = require("./wfclient.js")(client, alertMessages);
let ytClient = require("./ytclient.js")(client);
logger.info("Done loading save data.");
// End Load save data

//Load commands
var commands = require('./util/commands.js');
// End Load commands

client.on('ready', () => {
	logger.info('I am ready!');
});

client.on('message', message => {
    let isIgnored = message.guild
        && message.guild.id
        && guildSettings[message.guild.id].ignoredChannels
        && guildSettings[message.guild.id].ignoredChannels[message.channel.id];
	if (message.content.substring(0,1) === '!') {
		let args = message.content.substring(1).split(' ');
		let cmd = args[0].toLowerCase();
		if(commands.cmds[cmd] && (cmd === "ignore" || !isIgnored))
            commands.callCommand(cmd, message, args);
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
            logger.info('Hey! I have been mentioned!');
            reactTo(message, client.user.id);
            return;
        }
    }
});

client.on('guildMemberUpdate', function(oldMember, newMember) {
    let newTag = '';
    let pos = 0;

    let gid = newMember.guild.id;

    newMember.roles.array().forEach(function(role) {
        if((!guildSettings[gid] || !guildSettings[gid].checkhoist || role.hoist) && role.position > pos) {
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
        logger.warn(e.message);
    });
});

client.on('guildMemberAdd', function(member) {
    console.log(member.user.username + " just joined");
    let gid = member.guild.id;
    if(guildSettings[gid] && guildSettings[gid].welcomeMsgs) {
        for(let cid in guildSettings[gid].welcomeMsgs) {
            member.guild.channels.get(cid).send('<@' + member.id + '>, ' + guildSettings[gid].welcomeMsgs[cid]);
        }
    }
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
