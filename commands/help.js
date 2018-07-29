let logger = require('winston');
let commands = require('../util/commands.js');
let pkg = require('../package.json');

module.exports = {
    execute: function(args, message) {
        if(args.length > 2) {
            logger.log("Too many arguments for !help command.");
            return;
        }

        message.channel.send("For a list of my commands, have a look at " + pkg.repository);
        return;

        let fields = [];

        for(let cmd of commands.commands) {
            fields.push({

            });
        }
    },
    help: ""
};