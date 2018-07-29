var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = {
    execute: function(args, message) {
        if(args.length > 2) {
            logger.log("Too many Arguments provided for command '!joingame'!");
            return;
        }

        if(!args[1]) {
            logger.log("Not enough arguments for !joingame command.");
            return;
        }

        for(let g in games) {
            if(games[g].session !== args[1].toLowerCase() && games[g].players.indexOf(message.author.id) !== -1) {
                var oldGame = games[g];
                break;
            }
        }

        for(let g in games) {
            if(games[g].session === args[1].toLowerCase()) {
                if(games[g].dm === message.author.id) {
                    message.author.send("You are the current DM of the game '" + args[1].toLowerCase() + "'! You can't join it as a player!");
                    return;
                }
                if(games[g].maxPlayers === games[g].players.length) {
                    message.author.send("Game " + games[g].session + " is already full, sorry! :(");
                    return;
                }
                let msg = "";
                games[g].players.push(message.author.id);
                if(oldGame)
                    oldGame.players.splice(oldGame.players.indexOf(message.author.id), 1);
                if(oldGame)
                    msg = "You left game '" + oldGame.session + "' and joined game '" + games[g].session +"'.";
                else
                    msg = "Successfully joined game '" + games[g].session + "'!";
                message.reply(msg);
                return;
            }
        }

        message.reply("There is no game '" + args[1].toLowerCase() + "'! Have your DM create one using !claimdm " + args[1].toLowerCase());
    },
    help: "Usage: `!joingame <game>` where `<game>` is the name of the game you'd like to join.\n" +
        "Joins the game with the provided name if it isn't already full and you are not the DM of this game."
};