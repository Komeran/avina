let Discord = require('discord.js');
let logger = require('winston');
let auth = require('./auth.json');
let config = require('./config.json');

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

// Load commands
let commands = require('./util/commands.js');

// Load continuous behaviours
let continuous = require('./util/continuous.js');

// Client is ready
client.on('ready', () => {
	logger.info('I am ready!');
	//continuous.executeListeners('ready');
});

let events = require("./util/botEvents.json");

for(let event of events) {
    client.on(event, function() {
        continuous.executeListeners(event, arguments);
    });
}

client.login(auth.token);
// End Setup Discord client