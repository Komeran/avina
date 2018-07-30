var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var games = require('./dnd_util/games.js');
var fs = require("fs");
var path = require("path");
var config = require('./config.json');
let reactTo = require('./util/reactTo.js');

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
let gamesPath = path.join(__dirname, config.saving.path,"games.json");
if(fs.existsSync(gamesPath)) {
    let dataString = fs.readFileSync(gamesPath);
    let data = JSON.parse(dataString);
    for(let i = 0; i < data.length; i++) {
        games.push(data[i]);
	logger.debug("Game " + data[i].session + "loaded");
    }
    logger.info("Games save loaded.");
}
else {
	logger.info("No games save found.");
}
let appsPath = path.join(__dirname, config.saving.path,"applications.json")
if(fs.existsSync(appsPath)) {
    let dataString = fs.readFileSync(appsPath);
    applications = JSON.parse(dataString);
    logger.info("Applications save loaded.");
}
else {
    logger.info("No applications save found.");
}
logger.info("Done loading save data.");
// End Load save data

//Load commands
var commands = require('./util/commands.js');
// End Load commands

// Setup Discord client
var client = new Discord.Client();

client.on('ready', () => {
	logger.info('I am ready!');
});

client.on('message', message => {
	if (message.content.substring(0,1) === '!') {
		let args = message.content.substring(1).split(' ');
		let cmd = args[0];
		if(commands.cmds()[cmd])
            commands.callCommand(cmd, message, args);
	}
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

    newMember.roles.array().forEach(function(role) {
        if(role.hoist && role.position > pos) {
            pos = role.position;
            newTag = getTagForRole(role.id, newMember.guild.roles);
        }
    });

    let nickname = newMember.nickname;
    if(getRoleForTag(nickname.split(' ')[0].replace('[', '').replace(']', ''), newMember.guild.roles)) {
        nickname = nickname.substring(5, nickname.length);
    }

    newMember.edit({
        nick: newTag + ' ' + nickname
    }).catch(function(e) {
        logger.warn(e.message);
    });
});

client.login(auth.token);
// End Setup Discord client

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

function getTagForRole(role, roles) {
    for(let entry of roles) {
        let r = entry[1];
        if(r.id === role) {
            return r.name.substring(0, 4);
        }
    }
    return undefined;
}
