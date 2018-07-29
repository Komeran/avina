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

        for(let cmd in commands.commands) {
            fields.push({
                name: "!" + cmd,
                value: commands.commands[cmd].help
            });
        }

        message.channel.send({
            embed: {
                title: "List of my commands",
                color: 3447003,
                fields: fields
            }
        })
    },
    help: "Usage: `!help`\n" +
        "Lists all of my commands just like this!"
};