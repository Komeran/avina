var logger = require('winston');

module.exports = {
    execute: function(args, message) {
        if(!args[1]) {
            message.author.send('Missing dice Argument for !rolls command!');
            return;
        }

        let calculationString = "";

        for(let i = 1; i < args.length; i++) {
            calculationString += args[i];
        }
        calculationString = calculationString.toLowerCase();

        // First, let's go for mathematical approach and assume, there are maths to be done. We only do addition and subtraction though.

        let i = Number(calculationString.split('d')[0]);
        if(isNaN(i)) {
            return;
        }
        calculationString = calculationString.substring(calculationString.split('d')[0].length, calculationString.length);

        let replyString = "";

        for(let j = 0; j < i; j++) {
            let total = 0; // This is the total of the calculation. Reply with this.

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
            replyString += total + ", ";
        }

        replyString = replyString.substring(0, replyString.length-2) + "!";

        message.channel.send({
            embed: {
                title: message.guild.member(message.author).nickname + ' rolled:',
                color: 3447003,
                description: replyString
            }
        });
    },
    help: "Usage: `!rolls <dice>` where `<dice>` are the dice you want to roll (no calculations or mods).\n" +
        "rolls the dice and "
};
