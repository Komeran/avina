var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var games = require('./dnd_util/games.js');
var fs = require("fs");
var path = require("path");

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Load save data
logger.info("Loading save data...");
if(fs.existsSync(path.join(__dirname, "data/games.json"))) {
    let dataString = fs.readFileSync(path.join(__dirname, "data/games.json"));
    games = JSON.parse(dataString);
    logger.info("Games save loaded.");
}
else {
	logger.info("No games save found.");
}
if(fs.existsSync(path.join(__dirname, "data/applications.json"))) {
    let dataString = fs.readFileSync(path.join(__dirname, "data/applications.json"));
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

fs.readdirSync(normalizedPath).forEach(function(file) {
	var commandString = file.substring(0, file.length-3);
	commands[commandString] = require('./commands/' + file);
	callCommandString += "    case '" + commandString + "':\n" +
		"        commands['" + commandString + "'](args, message);\n" +
		"        break;" + "\n";
	logger.info("Loaded command [!" + commandString + "]");
});
callCommandString += "}";
var callCommand = new Function('cmd', 'message', 'args', 'cmds', callCommandString);
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
		console.log(games);
	}
});

client.login(auth.token);
// End Setup Discord client