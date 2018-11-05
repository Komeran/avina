let logger = require('winston');
let dbClient = require('../databaseClient.js');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;

class Initiative extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!initiative [<npc name>][advantage | disadvantage][<modifier>][advantage | disadvantage]` where `<modifier>` can be any calculation including dice and modifiers and `<npc name>` is the name of the npc you rolled initiative for if you are a DM. Also, only put either advantage or disadvantage once in the command parameters.\n" +
            "Examples: `!initiative +4-2d4+3+d8 advantage` or `!initiative disadv -3` or `!initiative adv` or `!initiative MrGenericGuy `\n" +
            "Will roll a d20 and add/subtract the given modifiers. Only addition and subtraction are supported at the moment! If advantage or disadvantage were given, it will roll twice and return the higher/lower result.";
    }

    /**
     * @override
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        if(!message.guild) {
            message.author.send("Sorry, but this command doesn't work in direct messages!");
            return;
        }

        if(!args[1]) {
            logger.info('Missing modifier argument for !initiative command!');
            return;
        }

        let gid = '' + message.guild.id;

        if(!games[gid]) {
            message.author.send("Sorry, but that server doesn't have any games running currently!");
            return;
        }

        let addNPC = false;
        let gameIdx = null;

        for(let g in games[gid]) {
            if(games[gid][g].dm === message.author.id) {
                addNPC = true;
                gameIdx = g;
                break;
            }
            if(!games[gid][g].initiative || !games[gid][g].initiative.open) {
                message.author.send("Sorry, but there is no open initiative round for this game right now!"); //TODO: Add to message how DM can reset initiative
                message.delete();
                return;
            }
            for(let i in games[gid][g].initiative.inits) {
                if(games[gid][g].initiative.inits[i].id === message.author.id) {
                    message.author.send("Sorry, but you already rolled initiative!"); //TODO: Add to message how DM can reset initiative
                    message.delete();
                    return;
                }
            }
        }

        let playerIdx = null;

        if(!addNPC) {
            loop1:
                for (let g in games[gid]) {
                    for (let p in games[gid][g].players) {
                        if (games[gid][g].players[p].id === message.author.id) {
                            gameIdx = g;
                            playerIdx = p;
                            break loop1;
                        }
                    }
                }
        }

        if(!addNPC && !playerIdx) {
            message.author.send("Sorry, but you haven't joined a game yet! Use !joingame <game> to do so!");
            return;
        }

        let advantageAliases = [
            "advantage",
            "adv",
            "ad",
            "a"
        ];

        let disadvantageAliases = [
            "disadvantage",
            "disadv",
            "disad",
            "dis",
            "da",
            "d"
        ];

        let startArg = 1;
        let endArg = args.length;
        let adv = false;
        let dis = false;

        if(addNPC) {
            //Check where the NPC name is, if there is one at all
        }

        if(advantageAliases.indexOf(args[1].toLowerCase()) !== -1 || disadvantageAliases.indexOf(args[1].toLowerCase()) !== -1) {
            startArg++;
            adv = advantageAliases.indexOf(args[1].toLowerCase()) !== -1;
            dis = disadvantageAliases.indexOf(args[1].toLowerCase()) !== -1
        }
        else if(advantageAliases.indexOf(args[args.length-1].toLowerCase()) !== -1 || disadvantageAliases.indexOf(args[args.length-1].toLowerCase()) !== -1) {
            endArg--;
            adv = advantageAliases.indexOf(args[args.length-1].toLowerCase()) !== -1;
            dis = disadvantageAliases.indexOf(args[args.length-1].toLowerCase()) !== -1;
        }

        let calculationString = "";

        for(let i = startArg; i < endArg; i++) {
            if(args[i])
                calculationString += args[i];
        }
        calculationString = calculationString.toLowerCase();

        let iterations = 1;

        if(adv || dis) {
            iterations++;
        }

        let totals = [];

        for(let i = 0; i < iterations; i++) {
            // First, let's go for mathematical approach and assume, there are maths to be done. We only do addition and subtraction though.

            let total = 0; // This is the total of the calculation. Reply with this.

            total += Math.floor(Math.random() * 20) + 1;

            // Separate the plus parts
            let plusParts = calculationString.split('+');
            for (let p = 0; p < plusParts.length; p++) {
                let plusToAdd = 0;
                // Now separate the minus parts

                let minusParts = plusParts[p].split('-');
                for (let m = 0; m < minusParts.length; m++) {
                    let minusToSubtract = 0;
                    let minusPart = minusParts[m];

                    if (minusPart[m] === "" && m === 0) {
                        continue;
                    }

                    if (minusPart.indexOf('d') === -1) {
                        if (!isNaN(Number(minusPart)))
                            minusToSubtract += Number(minusPart);
                        else {
                            message.author.send(minusPart + " is neither a valid die nor a valid number.");
                            return;
                        }
                    }
                    else if (minusPart.indexOf('d') === minusPart.lastIndexOf('d')) {
                        let diceCount = 1;
                        let diceValue = 2;
                        let dieParts = minusPart.split('d');
                        if (minusPart.indexOf('d') !== 0) {
                            diceCount = Number(dieParts[0]);
                            if (isNaN(diceCount)) {
                                message.author.send(minusPart + " is neither a valid die nor a valid number.");
                                return;
                            }
                        }
                        diceValue = Number(dieParts[1]);
                        if (isNaN(diceValue) || diceValue < 2) {
                            message.author.send(minusPart + " is neither a valid die nor a valid number.");
                            return;
                        }
                        let result = 0;
                        for (let i = 1; i <= diceCount; i++) {
                            result += Math.floor(Math.random() * diceValue) + 1;
                        }
                        minusToSubtract += result;
                    }
                    else {
                        message.author.send(minusPart + " is neither a valid die nor a valid number.");
                        return;
                    }
                    // Now subtract the resulting minusToSubtract from plusToAdd.

                    if (m === 0) {
                        plusToAdd += minusToSubtract;
                    }
                    else {
                        plusToAdd -= minusToSubtract;
                    }
                }
                // Now add the resulting plusToAdd to the total.
                total += plusToAdd;
            }
            totals.push(total);
        }

        let total = adv ? Math.max(totals[0], totals[1]) : (dis? Math.min(totals[0], totals[1]) : totals[0]);

        message.channel.send({
            embed: {
                title: message.guild.member(message.author).nickname + " rolled a " + total + " for initiative.",
                color: 3447003
            }
        });
    }
}

module.exports = null; //Initiative; // TODO: Uncomment once functionality is implemented
