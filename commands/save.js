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

emitter.on("games", function(message, savingMessage) {
    saveApplications(message, savingMessage);
});
emitter.on("applications", function(message, savingMessage) {
    message.channel.send("Saving complete!");
    isSaving = false;
    savingMessage.delete();
    message.delete();
});

module.exports = {
    execute: function(args, message) {
        if(args.length > 1) {
            logger.log("Too many arguments for command '!save'.");
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
            saveGames(message, msg);
        });
    },
    help: ""
};

let saveGames = function(message, msg) {
    let json = JSON.stringify(games);

    if(!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath);
    }

    fs.writeFile(path.join(dataPath, 'games.json'), json, 'utf8', function(err) {
        if(err) {
            message.channel.send("Something went wrong during saving! Please tell your server admin!");
            logger.warn(err);
            return;
        }
        emitter.emit("games", message, msg);
    });
};

let saveApplications = function(message, msg) {
    let json = JSON.stringify(applications);

    if(!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath);
    }

    fs.writeFile(path.join(dataPath, 'applications.json'), json, 'utf8', function(err) {
        if(err) {
            message.channel.send("Something went wrong during saving! Please tell your server admin!");
            logger.warn(err);
            return;
        }
        emitter.emit("applications", message, msg);
    });
};