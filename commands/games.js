var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = function(args, message) {
    let msg = "List of currently running games:"
    games.forEach(function(game) {
        msg += "\n" + game.session + "(DM: <@" + game.dm + ">, players: " + game.players.length + ")";
    }, this);

    if(games.length === 0) {
        message.channel.send("There are no games currently! Be the first to start one using !claimdm <Game> , or have your DM do it!");
        return;
    }

    message.channel.send(msg);
};