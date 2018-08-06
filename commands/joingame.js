var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        if(args.length > 2) {
            logger.log("Too many Arguments provided for command '!joingame'!");
            return;
        }

        if(!args[1]) {
            logger.log("Not enough arguments for !joingame command.");
            return;
        }

        let gid = '' + message.guild.id;

        if(!games[gid]) {
            message.author.send("Sorry, but that server doesn't have any games running currently!");
            return;
        }

        loop1:
            for(let g in games[gid]) {
                if(games[gid][g].session !== args[1].toLowerCase()) {
                    for(let p in games[gid][g].players) {
                        if(games[gid][g].players[p].id === message.author.id) {
                            var oldGame = games[gid][g];
                            var oldIdx = p;
                            break loop1;
                        }
                    }
                }
            }

        for(let g in games[gid]) {
            if(games[gid][g].session === args[1].toLowerCase()) {
                if(games[gid][g].dm === message.author.id) {
                    message.author.send("You are the current DM of the game '" + args[1].toLowerCase() + "'! You can't join it as a player!");
                    return;
                }
                if(games[gid][g].maxPlayers === games[gid][g].players.length) {
                    message.author.send("Game " + games[gid][g].session + " is already full, sorry! :(");
                    return;
                }
                let msg = "";
                games[gid][g].players.push({
                    id: message.author.id
                });
                if(oldGame)
                    oldGame.players.splice(oldIdx, 1);
                if(oldGame)
                    msg = "You left game '" + oldGame.session + "' and joined game '" + games[gid][g].session +"'.";
                else
                    msg = "Successfully joined game '" + games[gid][g].session + "'!";
                message.reply(msg);
                return;
            }
        }

        message.reply("There is no game '" + args[1].toLowerCase() + "'! Have your DM create one using !claimdm " + args[1].toLowerCase());
    },
    help: "Usage: `!joingame <game>` where `<game>` is the name of the game you'd like to join.\n" +
        "Joins the game with the provided name if it isn't already full and you are not the DM of this game."
};