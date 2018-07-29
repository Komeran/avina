let logger = require('winston');

module.exports = function(message, clientId) {
    let arr = message.content.replace('<@' + clientId + '>', '').split(' ');
    let msg = "";
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] && arr[i] !== '') {
            msg += arr[i] + " ";
        }
    }
    msg = msg.substring(0, msg.length-1);

    if(msg.toLowerCase() === "thanks" || msg.toLowerCase() === "thx" || msg.toLowerCase() === "thy" || msg.toLowerCase() === "thank you") {
        message.reply("You're welcome! 😊");
    }
    if(msg.toLowerCase() === "good bot" || msg.toLowerCase() === "nice" || msg.toLowerCase() === "awesome!" || msg.toLowerCase() === "awesome !") {
        message.reply("😁");
    }
};