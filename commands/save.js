/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

var logger = require('winston');
var games = require('../dnd_util/games.js');
var applications = require('../util/applications.js');
var fs = require("fs");
var path = require('path');
var events = require('events');
var isSaving = false;

const emitter = new events.EventEmitter();

emitter.on("games", function(message) {
    saveApplications(message);
});
emitter.on("applications", function(message) {
    message.channel.send("Saving complete!");
    isSaving = false;
});

module.exports = function(args, message) {
    if(args.length > 1) {
        logger.log("Too many arguments for command '!save'.");
        return;
    }

    if(!message.guild.member(message.author).hasPermission('ADMINISTRATOR')) {
        message.author.send("Only admins of a server may use the !save command! And you are no admin, sorry :/");
        return;
    }

    if(isSaving) {
        message.author.send("I'm already on it! Please be patient with me, sometimes saving lots of data takes a while :(");
        return;
    }

    // Start saving process...
    message.channel.send("Saving...");
    isSaving = true;
    saveGames(message);
};

let saveGames = function(message) {
    var json = JSON.stringify(games);

    if(!fs.existsSync(path.join(__dirname, "../data"))) {
        fs.mkdirSync(path.join(__dirname, "../data"));
    }

    fs.writeFile(path.join(__dirname, '../data/games.json'), json, 'utf8', function(err) {
        if(err) {
            message.channel.send("Something went wrong during saving! Please tell your server admin!");
            logger.warn(err);
            return;
        }
        emitter.emit("games", message);
    });
};

let saveApplications = function(message) {
    var json = JSON.stringify(applications);

    if(!fs.existsSync(path.join(__dirname, "../data"))) {
        fs.mkdirSync(path.join(__dirname, "../data"));
    }

    fs.writeFile(path.join(__dirname, '../data/applications.json'), json, 'utf8', function(err) {
        if(err) {
            message.channel.send("Something went wrong during saving! Please tell your server admin!");
            logger.warn(err);
            return;
        }
        emitter.emit("applications", message);
    });
};