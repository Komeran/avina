/**
 * @author marc.schaefer
 * @date 01.08.2018
 */

var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        let embed = {
            color: 3447003,
            title: "List of running Games",
            description: "",
            fields: []
        };

        games.forEach(function(game) {
            embed.fields.push({
                name: game.session,
                value: "DM: <@" + game.dm + ">\nPlayers: " + game.players.length + "/" + game.maxPlayers
            });
        }, this);

        if(games.length === 0) {
            embed.description = "There are no games currently! Be the first to start one using !claimdm <Game> , or have your DM do it!";
        }

        if(args.length <= 2) {
            var suitNumber = Number(args[1]);
            

            message.author.send("", { file:'./ironman/suits/'+result+'.png' });
            dm.send("", { file:'./ironman/suits/'+result+'.png' });
        }
    },
    help: "Usage: `!games`\n" +
        "Lists the current running games including their DMs and Player Numbers"
};