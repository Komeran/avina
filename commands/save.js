/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

let logger = require('winston');
let games = require('../dnd_util/games.js');
let applications = require('../util/applications.js');
let fs = require("fs");
let path = require('path');
let events = require('events');
let isSaving = false;
let config = require('../config.json');
let auth = require('../auth.json');
let guildSettings = require('../util/guildSettings.js');
let wfclient = require('../wfclient.js')();
let connection;
if(auth.database)
    connection = require('mysql').createConnection(auth.database);

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

let dataPath = path.join(__dirname, "..", config.saving.path);

const emitter = new events.EventEmitter();

emitter.on("guildSettings", function(message, savingMessage, json) {
    saveGames(message, savingMessage, json);
});
emitter.on("games", function(message, savingMessage, json) {
    saveWfAlertMessages(message, savingMessage, json);
});
emitter.on("wfAlertMessages", function(message, savingMessage, json) {
    saveApplications(message, savingMessage, json);
});
emitter.on("applications", function(message, savingMessage) {
    message.channel.send("Saving complete!");
    isSaving = false;
    savingMessage.delete();
    message.delete();
});

const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class Save extends BaseCommand {
    constructor() {
        super();
        this.help = "Admin only command!";
    }

    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if(args.length > 1) {
            logger.log("Too many arguments for command '!save'.");
            return;
        }

        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        if(!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
            message.author.send("Only admins of a server may use the !save command! And you are no admin, sorry :/");
            message.delete();
            return;
        }

        if(isSaving) {
            message.author.send("I'm already on it! Please be patient with me, sometimes saving lots of data takes a while :(");
            message.delete();
            return;
        }

        // Start saving process...
        message.channel.send("Saving...").then(function(msg) {
            isSaving = true;
            saveGuildSettings(message, msg, true);
        });
    }
}

module.exports = Save;

let saveGames = function(message, msg, json) {

    if(!json) {
        let gid = message.guild.id;
        let gameQuery = "INSERT INTO ga_games (ga_name,ga_u_dm,ga_g_guild) VALUES ";
        if(!games[gid]) {
            //THERE IS NOTHING TO SAVE FOR THIS GUILD!
            connection.end();
            return;
        }
        for (let g of games[gid]) {
            let game = games[gid][g];
            gameQuery += "('" + game.session + "'," + game.dm + "," + gid + "),";
        }
        gameQuery = gameQuery.substring(0, gameQuery.length-1) + ";";
        connection.query(gameQuery, null, function (e) {
            if (e) {
                console.log("YE");
                logger.error(e.message);
            }
        });

        for(let g of games[gid]) {
            let game = games[gid][g];
            let gameQuery = "INSERT INTO ga_games (ga_name,ga_u_dm,ga_g_guild) VALUES ";
        }


        emitter.emit("games", message, msg, json);
    }
    else {
        let data = JSON.stringify(games);

        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath);
        }

        fs.writeFile(path.join(dataPath, 'games.json'), data, 'utf8', function (err) {
            if (err) {
                message.channel.send("Something went wrong during saving! Please tell your main server admin!");
                logger.warn(err);
                return;
            }
            emitter.emit("games", message, msg, json);
        });
    }
};

let saveApplications = function(message, msg, json) {
    if(json) {
        let data = JSON.stringify(applications);

        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath);
        }

        fs.writeFile(path.join(dataPath, 'applications.json'), data, 'utf8', function (err) {
            if (err) {
                message.channel.send("Something went wrong during saving! Please tell your main server admin!");
                logger.warn(err);
                return;
            }
            emitter.emit("applications", message, msg, json);
        });
    }
    else {
        // DATABASE SAVE
        emitter.emit("applications", message, msg, json);
    }
};

let saveGuildSettings = function(message, msg, json) {
    if(json) {
        let data = JSON.stringify(guildSettings);

        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath);
        }

        fs.writeFile(path.join(dataPath, 'guildSettings.json'), data, 'utf8', function (err) {
            if (err) {
                message.channel.send("Something went wrong during saving! Please tell your main server admin!");
                logger.warn(err);
                return;
            }
            emitter.emit("guildSettings", message, msg, json);
        });
    }
};

let saveWfAlertMessages = function(message, msg, json) {
    if(json) {
        let data = JSON.stringify(wfclient.getAlertMessages());

        if (!fs.existsSync(dataPath)) {
            fs.mkdirSync(dataPath);
        }

        let wfPath = path.join(dataPath, 'warframe');

        if (!fs.existsSync(wfPath)) {
            fs.mkdirSync(wfPath);
        }

        fs.writeFile(path.join(wfPath, 'alertMessages.json'), data, 'utf8', function (err) {
            if (err) {
                message.channel.send("Something went wrong during saving! Please tell your main server admin!");
                logger.warn(err);
                return;
            }
            emitter.emit("wfAlertMessages", message, msg, json);
        });
    }
};