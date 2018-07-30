/**
 * @author marc.schaefer
 * @date 26.07.2018
 */

var logger = require('winston');
var currentGames = require('../dnd_util/games.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        if(args.length > 3) {
            logger.info('The !claimdm command takes only 1 argument but it was given at least 2!');
            return;
        }

        if(!args[1]) {
            logger.log("Not enough arguments for !claimdm command.");
            return;
        }

        let cg = currentGames[message.guild.id];

        if(!cg) {
            currentGames[message.guild.id] = [];
        }

        for(let game in cg) {
            if(cg[game].dm === message.author.id) {
                message.reply("You are already DM of game '" + cg[game].session + "'. Please use !abandondm first before" +
                    " claiming DM status of a new game.");
                return;
            }
        }

        for(let game in cg) {
            if(cg[game].session === args[1].toLowerCase()) {
                cg[game].claimRequester = message.author.id;
                message.reply("<@" + cg[game].dm + "> is the current DM of game '" + cg[game].session + "'. Your request for" +
                    " a claim has been noted. As soon as the current DM uses the !abandondm command, you will be the new" +
                    " DM.");
                return;
            }
        }

        currentGames[message.guild.id].push({
            session: args[1].toLowerCase(),
            dm: message.author.id,
            players: [],
            quests: [],
            maxPlayers: 6
        });

        if(args[2] && !isNaN(Number(args[2])) && Number(args[2]) % 1 === 0)
            currentGames[message.guild.id][currentGames[message.guild.id].length-1].maxPlayers = Number(args[2]);

        message.reply("You successfully created the game '" + args[1].toLowerCase() + "'! Players can now use !joingame " + args[1].toLowerCase()
            + " to join the game!");
    },
    help: "Usage: `!claimdm <game>` where `<game>` can be any text without spaces.\n" +
        "Creates a new game with the provided name if it doesn't exist already. If it does, a claim request will be noted. " +
        "Once the current DM of the game abandons it, you will be the new DM."
};