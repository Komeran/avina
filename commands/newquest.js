/**
 * @author marc.schaefer
 * @date 27.07.2018
 */

let logger = require('winston');
let dbClient = require('../databaseClient.js');
const DnDQuest = require('../databaseClient.js').DnDQuest;
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class NewQuest extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!newquest <quest>` where `<quest>` is the name (including spaces) of the quest you'd like to create.\n" +
            "Creates a new quest with the given name for the game you are currently DMing. Only DMs may use this command.";
    }

    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            message.delete();
            return;
        }

        if(!args[1]) {
            message.author.send("Not enough arguments for !newquest command.");
            message.delete();
            return;
        }

        let gid = message.guild.id;
        let dmId = message.author.id;

        dbClient.getDnDGamesByDM(gid, dmId).then(function(game) {
            if(!game) {
                message.author.send("Sorry, but you are currently not the DM of a game. New quests can only be added by DMs!");
                return;
            }

            dbClient.getDnDQuests(gid, game.id).then(function(quests) {
                let qid = quests? quests.length : 0;

                let questDescription = "";
                for(let i = 1; i < args.length; i++) {
                    questDescription += args[i] + " ";
                }
                questDescription = questDescription.substring(0, questDescription.length-1);

                let quest = new DnDQuest(qid, game.id, gid, questDescription, false);

                dbClient.addDnDQuests(quest).then(function() {
                    message.channel.send({
                        embed: {
                            title: "Added Quest to game " + game.name,
                            description: "[" + quest.id + "] " + quest.description,
                            color: 3447003
                        }
                    });
                }).catch(errorFunc.bind(this, message));
            }).catch(errorFunc.bind(this, message));
        }).catch(errorFunc.bind(this, message));
    }
}

module.exports = NewQuest;

/**
 * Relays an error message to the default error output and tells the user to consult admins.
 * @param [message] {Message}
 * @param error {Error}
 */
function errorFunc(message, error) {
    logger.error(error);
    if(message) {
        message.author.send("Sorry, but something went wrong. If this keeps happening, please tell your admin!");
        message.delete();
    }
}