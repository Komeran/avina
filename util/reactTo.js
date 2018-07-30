let logger = require('winston');
let reactions = require('./reactions.json');

module.exports = function(message, clientId) {
    let arr = message.content.replace('<@' + clientId + '>', '').replace(/[.?!",\/#!$%\^&\*;:{}=\-_`~()]/g, '').split(' ');
    let msg = "";
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] && arr[i] !== '') {
            msg += arr[i] + " ";
        }
    }
    msg = msg.substring(0, msg.length-1).toLowerCase().replace(' avina ', ' ');
    if(msg.indexOf("avina") === 0) {
        msg = msg.substring(6, msg.length);
    }
    if(msg.indexOf("avina") === msg.length - 5) {
        msg = msg.substring(0, msg.length-6);
    }

    for(let i = 0; i < reactions.length; i++) {
        if(reactions[i].triggers.includes(msg)) {
            let rnd = Math.floor(Math.random() * reactions[i].responses.length-1) + 1;
            message.channel.send(reactions[i].responses[rnd]);
            return;
        }
    }
};
