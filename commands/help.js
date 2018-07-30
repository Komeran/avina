var logger = require('winston');
var commands = require('../bot.js').commands;
let pkg = require('../package.json');

module.exports = {
    execute: function(args, message) {
        if(args.length > 2) {
            logger.log("Too many arguments for !help command.");
            return;
        }

        let fields = [];

        console.log(commands.cmds());

        for(let cmd in commands.cmds()) {
            fields.push({
                name: "!" + cmd,
                value: commands.cmds()[cmd].help
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
