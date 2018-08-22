/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

let logger = require('winston');
let dbClient = require('../databaseClient.js');
import DnDQuest from '../databaseClient.js';

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        if(!args[1]) {
            logger.log("Not enough arguments for !newquest command.");
            return;
        }

        let gid = message.guild.id;
        let dmId = message.author.id;

        let game = dbClient.getDnDGameByDM(gid, dmId);

        if(!game) {
            message.author.send("Sorry, but you are currently not the DM of a game. New quests can only be added by DMs!");
            return;
        }

        let quests = dbClient.getDnDQuests(gid, game.id);

        let qid = quests? quests.length : 0;

        let questDescription = "";
        for(let i = 1; i < args.length; i++) {
            questDescription += args[i] + " ";
        }
        questDescription = questDescription.substring(0, questDescription.length-1);

        let quest = new DnDQuest(qid, game.id, gid, questDescription, false);

        dbClient.addDnDQuests(quest);

        let newQuest = dbClient.getDnDQuest(gid, game.id, qid);

        if(newQuest) {
            message.channel.send({
                embed: {
                    title: "Added Quest to game " + game.name,
                    description: "[" + newQuest.id + "] " + newQuest.description,
                    color: 3447003
                }
            });
            return;
        }
        message.author.send("Sorry, but something went wrong. The Quest was not added. If this keeps happening, please tell your admin!");
    },
    help: "Usage: `!newquest <quest>` where `<quest>` is the name (including spaces) of the quest you'd like to create.\n" +
        "Creates a new quest with the given name for the game you are currently DMing. Only DMs may use this command."
};