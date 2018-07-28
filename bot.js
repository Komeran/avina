var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var games = require('./dnd_util/games.js');
var fs = require("fs");
var path = require("path");
var config = require('./config.json');

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
    games = JSON.parse(dataString);
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
var normalizedPath = path.join(__dirname, "commands");
logger.info("Loading commands...");
var callCommandString = "var commands = cmds;\nswitch(cmd) {\n";
var commands = {};
let cmdCount = 0;

fs.readdirSync(normalizedPath).forEach(function(file) {
	var commandString = file.substring(0, file.length-3);
	commands[commandString] = require('./commands/' + file);
	callCommandString += "    case '" + commandString + "':\n" +
		"        commands['" + commandString + "'](args, message);\n" +
		"        break;" + "\n";
	logger.debug("Loaded command [!" + commandString + "]");
    cmdCount++;
});
callCommandString += "}";
var callCommand = new Function('cmd', 'message', 'args', 'cmds', callCommandString);
logger.info("Loaded " + cmdCount + " commands.");
// End Load commands

// Setup Discord client
var client = new Discord.Client();

client.on('ready', () => {
	logger.info('I am ready!');
});

client.on('message', message => {
	if (message.content.substring(0,1) === '!') {
		var args = message.content.substring(1).split(' ');
		var cmd = args[0];

		callCommand(cmd, message, args, commands);
	}
});

client.login(auth.token);
// End Setup Discord client