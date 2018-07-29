var logger = require('winston');

module.exports = {
    execute: function(args, message) {
        if(args.length > 2) {
            return;
        }

        if(!args[1]) {
            logger.log("Not enough arguments for !rolls command.");
            return;
        }

        if(args[1].indexOf('d') === -1 || args[1].indexOf('d') !== args[1].lastIndexOf('d')) {
            // TODO: Reply that args[1] is neither a valid die, nor a number
            return;
        }

        let parts = args[1].split('d');

        let diceCount = 1;

        if(parts[0] !== "" && isNaN(Number(parts[0]))) {
            return;
        }
        if(parts[0] !== "") {
            diceCount = Number(parts[0]);
        }

        let diceValue = Number(parts[1]);

        if(isNaN(diceValue)) {
            return;
        }

        let replyString = "";
        for(let i = 0; i < diceCount; i++) {
            let result = Math.floor(Math.random() * diceValue) + 1;
            replyString += result + ", ";
        }
        replyString = replyString.substring(0, replyString.length-2) + "!";

        message.channel.send({
            embed: {
                title: message.author.username + ' rolled:',
                color: 3447003,
                description: replyString
            }
        });
    },
    help: "Usage: `!rolls <dice>` where `<dice>` are the dice you want to roll (no calculations or mods).\n" +
        "rolls the dice and "
};
