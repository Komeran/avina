var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
/*
 * var apply = require('./commands/apply.js');
 * var roll = require('./commands/roll.js');
 * var clean = require('./commands/clean.js');
 * var draw = require('./commands/draw.js');
 * var rolls = require('./commands/rolls.js');
 * */
var normalizedPath = require("path").join(__dirname, "commands");

var callCommandString = "var commands = cmds;\nswitch(cmd) {\n";

var commands = {};

require("fs").readdirSync(normalizedPath).forEach(function(file) {
	var commandString = file.substring(0, file.length-3);
	commands[commandString] = require('./commands/' + file);
	callCommandString += "    case '" + commandString + "':\n" +
		"        commands['" + commandString + "'](args, message);\n" +
		"        break;" + "\n";
});

callCommandString += "}";

var callCommand = new Function('cmd', 'message', 'args', 'cmds', callCommandString);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

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

