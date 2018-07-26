/**
 * @author marc.schaefer
 * @date 26.07.2018
 */

var logger = require('winston');

var currentGames = [];

module.exports = function(args, message) {
    if(args.length > 2) {
        logger.info('The !claimdm command takes only 1 argument but it was given at least 2!');
        return;
    }

    for(let game in currentGames) {
        if(currentGames[game].dm.id === message.author.id) {
            message.reply("You are already DM of game '" + currentGames[game].session + "'. Please use !abandondm first before" +
                " claiming DM status of a new game.");
        }
    }

    currentGames.forEach(function(game) {
        if(game.session === args[1].toLowerCase()) {
            game.claimRequester = message.author;
            message.reply("<@" + game.dm.id + "> is the current DM of game '" + game.session + "'. Your request for" +
                " a claim has been noted. As soon as the current DM uses the !abandondm command, you will be the new" +
                " DM.");
        }
    });
};