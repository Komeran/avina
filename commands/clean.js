var logger = require('winston');

module.exports = function(args, message) {
    if(args.length > 1) {
        logger.info('The !clean command takes no arguments but it was given at least 1!');
        return;
    }

    message.channel.messages.array().forEach(function(msg) {
        msg.delete();
    }, this);
}