var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var apply = require('./commands/apply.js');
var roll = require('./commands/roll.js');
var clean = require('./commands/clean.js');
var draw = require('./commands/draw.js');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

var client = new Discord.Client();

client.on('ready', () => {
  logger.info('I am ready!');
});

client.on('message', message => {
  if (message.content.substring(0,1) == '!') {
    var args = message.content.substring(1).split(' ');
    var cmd = args[0];

    switch(cmd) {
        case 'ping':
            message.channel.send('pong!');
            break;
        case 'apply':
            //apply(args, message);
            break;
        case 'roll':
            roll(args, message);
            break;
        case 'clean':
            //clean(args, message);
            break;
        case 'draw':
            draw(args, message);
    }
    // message.delete();
  }
});

client.login(auth.token);
