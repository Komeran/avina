var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = function(args, message) {
    let embed = {
        color: 3447003,
        title: "List of running Games",
        description: "",
        fields: []
    };

    games.forEach(function(game) {
        embed.fields.push({
            name: game.session,
            value: "DM: <@" + game.dm + ">\nPlayers: " + game.players.length
        });
    }, this);

    if(games.length === 0) {
        embed.description = "There are no games currently! Be the first to start one using !claimdm <Game> , or have your DM do it!";
    }

    message.channel.send(embed);
};