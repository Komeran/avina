/**
 * @author marc.schaefer
 * @date 26.07.2018
 */

var logger = require('winston');
var currentGames = require('../dnd_util/games.js');

module.exports = function(args, message) {
    if(args.length > 3) {
        logger.info('The !claimdm command takes only 1 argument but it was given at least 2!');
        return;
    }

    if(!args[1]) {
        logger.log("Not enough arguments for !claimdm command.");
        return;
    }

    for(let game in currentGames) {
        if(currentGames[game].dm === message.author.id) {
            message.reply("You are already DM of game '" + currentGames[game].session + "'. Please use !abandondm first before" +
                " claiming DM status of a new game.");
                return;
        }
    }

    for(let game in currentGames) {
        if(currentGames[game].session === args[1].toLowerCase()) {
            currentGames[game].claimRequester = message.author.id;
            message.reply("<@" + currentGames[game].dm + "> is the current DM of game '" + currentGames[game].session + "'. Your request for" +
                " a claim has been noted. As soon as the current DM uses the !abandondm command, you will be the new" +
                " DM.");
            return;
        }
    }

    currentGames.push({ 
        session: args[1].toLowerCase(),
        dm: message.author.id,
        players: [],
        quests: [],
        maxPlayers: 6
    });

    if(args[2] && !isNaN(Number(args[2])) && Number(args[2]) % 1 === 0)
        currentGames[currentGames.length-1].maxPlayers = Number(args[2]);

    message.reply("You successfully created the game '" + args[1].toLowerCase() + "'! Players can now use !joingame " + args[1].toLowerCase()
        + " to join the game!");
};