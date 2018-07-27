/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

var logger = require('winston');
var games = require('../dnd_util/games.js');

module.exports = function(args, message) {

    if(!args[1]) {
        logger.log("Not enough arguments for !newquest command.");
        return;
    }

    let questDescription = "";
    for(let i = 1; i < args.length; i++) {
        questDescription += args[i] + " ";
    }
    questDescription = questDescription.substring(0, questDescription.length-1);

    for(let g in games) {
        if(games[g].dm === message.author.id) {
            if(!games[g].quests)
                games[g].quests = [];
            games[g].quests.push({
                description: questDescription,
                completed: false
            });
            message.channel.send({
                embed: {
                    title: "Added Quest to game " + games[g].session,
                    description: "[" + games[g].quests.length + "] " + questDescription,
                    color: 3447003
                }
            });
            return;
        }
    }
    message.author.send("Sorry, but you are currently not the DM of a game. New quests can only be added by DMs!");
};