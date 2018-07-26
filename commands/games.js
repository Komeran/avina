var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = function(args, message) {
    let msg = "List of currently running games:"
    games.forEach(function(game) {
        msg += "\n" + game.session + "(DM: <@" + game.dm + ">, players: " + game.players.length + ")";
    }, this);
    message.channel.send(msg);
};