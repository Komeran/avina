var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        let gid = '' + message.guild.id;

        if(!games[gid]) {
            message.author.send("Sorry, but that server doesn't have any games running currently!");
            return;
        }

        let embed = {
            color: 3447003,
            title: "List of running Games",
            description: "",
            fields: []
        };

        games[gid].forEach(function(game) {
            embed.fields.push({
                name: game.session,
                value: "DM: <@" + game.dm + ">\nPlayers: " + game.players.length + "/" + game.maxPlayers
            });
        }, this);

        if(games[gid].length === 0) {
            embed.description = "There are no games currently! Be the first to start one using !claimdm <Game> , or have your DM do it!";
        }

        message.channel.send({'embed': embed});
    },
    help: "Usage: `!games`\n" +
        "Lists the current running games including their DMs and Player Numbers"
};