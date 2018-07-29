let fs = require('fs');
let path = require('path');
let logger = require('winston');

let normalizedPath = path.join(__dirname, "../commands");
logger.info("Loading commands...");
let callCommandString = "let commands = cmds;\nswitch(cmd) {\n";
let commands = {};
let cmdCount = 0;

fs.readdirSync(normalizedPath).forEach(function(file) {
    let commandString = file.substring(0, file.length-3);
    commands[commandString] = require(path.join(normalizedPath, file));
    callCommandString += "    case '" + commandString + "':\n" +
        "        commands['" + commandString + "'].execute(args, message);\n" +
        "        break;" + "\n";
    logger.debug("Loaded command [!" + commandString + "]");
    cmdCount++;
});
callCommandString += "}";
let callCommand = new Function('cmd', 'message', 'args', 'cmds', callCommandString);
logger.info("Loaded " + cmdCount + " commands.");

module.exports = {
    commands: commands,
    callCommand: function(cmd, message, args) {
        return callCommand(cmd, message, args, commands);
    }
};