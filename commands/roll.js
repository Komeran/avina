var logger = require('winston');

module.exports = function (args, message) {
    if(message.channel.name != 'dnd-dice') {
        logger.info('Someone tried to roll a dice in the wrong channel... This is a D&D only feature!');
        return;
    }

    if(!args[1]) {
        logger.info('Missing Die Argument for !roll command!');
        return;
    }

    if(args.length == 2) {
        var die = args[1];
        var diceSides;
        if(die.toLowerCase()[0] == 'd') {
            diceSides = parseInt(die.substring(1));
        }
        else {
            diceSides = parseInt(die);
        }
        if(diceSides <= 1) {
            logger.info('Someone tried to use a d'+diceSides);
            logger.info('How funny...');
            return;
        }
        var result = Math.floor(Math.random() * diceSides) + 1;
        if(isNaN(result)) {
            logger.info('Someone tried to roll something that is NaN!');
            return;
        }
        message.reply('You rolled a '+result);
    }
}
