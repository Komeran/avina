var logger = require('winston');
let pkg = require('../package.json');

module.exports = {
    execute: function(args, message) {
        if(args.length > 2) {
            logger.log("Too many arguments for !help command.");
            return;
        }

        let commands = require('../util/commands.js');

        let fields = [];

        for(let cmd in commands.cmds) {
            fields.push({
                name: "!" + cmd,
                value: (commands.cmds[cmd].help && commands.cmds[cmd].help !== "") ? commands.cmds[cmd].help : "-"
            });
        }

        message.channel.send({
            embed: {
                title: "List of my commands",
                color: 3447003,
                fields: fields
            }
        }).catch(e => logger.warn(e.message));
    },
    help: "Usage: `!help`\n" +
        "Lists all of my commands just like this!"
};
