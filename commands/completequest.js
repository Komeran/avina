/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

let logger = require('winston');
let dbClient = require('../databaseClient.js');

module.exports = {
    execute: function(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        if(args.length > 2) {
            logger.log("Too many arguments for !completequest command.");
            return;
        }

        if(!args[1]) {
            logger.log("Not enough arguments for !completequest command.");
            return;
        }

        let id = Number(args[1]);

        if(isNaN(id) || id % 1 !== 0) {
            message.author.send(args[1] + " is not a valid Quest ID!");
            return;
        }

        let gid = message.guild.id;
        let dmId = message.author.id;

        let game = dbClient.getDnDGameByDM(gid, dmId);

        if(!game) {
            message.author.send("Sorry, but you are currently not the DM of a game. Quests can only be (un-)completed by DMs!");
            return;
        }

        let quest = dbClient.getDnDQuest(gid, game.id, id);

        if(!quest) {
            message.author.send("Sorry, but there is no quest with ID " + id + " in the game '" + game.name + "!");
            return;
        }

        quest.completed = !quest.completed;

        dbClient.addDnDQuests(quest);

        let newQuest = dbClient.getDnDQuest(gid, game.id, id);

        if(newQuest && newQuest.completed === quest.completed) {
            message.channel.send({
                embed: {
                    title: "Quest of game " + game.name + " has been " + (newQuest.completed ? "" : "un") + "completed!",
                    description: "[" + newQuest.id + "] " + newQuest.description,
                    color: 3447003
                }
            });
            return;
        }
        message.author.send("Sorry, but something went wrong. The Quest was not updated. If this keeps happening, please tell your admin!");
    },
    help: "Usage: `!completequest <ID>` where `<ID>` is the ID number of a quest\n" +
        "Marks the quest with the provided ID number as completed if it was open, or as open if it was completed. Only DMs may use this command."
};
