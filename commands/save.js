/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

var logger = require('winston');
var games = require('../dnd_util/games.js');
var fs = require("fs");

module.exports = function(args, message) {
    if(args.length > 1) {
        logger.log("Too many arguments for command '!save'.");
        return;
    }

    message.channel.send("Saving...");

    var json = JSON.stringify(games);


    if(!fs.existsSync("../data")) {
        fs.mkdirSync("../data");
    }

    fs.writeFile('../data/games.json', json, 'utf8', function(err) {
        if(err) {
            message.channel.send("Something went wrong during saving! Please tell your server admin!");
            logger.warn(err);
            return;
        }
        message.channel.send("Saving complete!");
    });
};