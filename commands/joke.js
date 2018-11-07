/**
 * @author marc.schaefer
 * @date 07.11.2018
 */

let logger = require('winston');
const BaseCommand = require("../util/BaseCommand");
const Message = require("discord.js").Message;
const request = require("request");

class joke extends BaseCommand {
    constructor() {
        super();
        this.help = "Usage: `!joke [<term>]` where `<term>` is an optional search term that the joke has to contain.\n" +
            "Searches for a random joke containing the given term and replies it, or sends an entirely random joke if no" +
            " term was provided.";
    }

    /**
     *
     * @param args {string[]}
     * @param message {Message}
     */
    execute(args, message) {
        let searchTerm = null;
        if(args.length > 1) {
            searchTerm = args[1];
            for(let i = 2; i < args.length; i++) {
                searchTerm += " " + args[i];
            }
        }

        let wasCommand = args[0] !== null;

        if(searchTerm) {
            request({
                method: 'GET',
                uri: "https://icanhazdadjoke.com/search?term=" + searchTerm,
                headers: {
                    'Accept': 'text/plain'
                }
            }, function(error, response, body) {
                let jokes = body.split('\n');
                let randomJoke = Math.floor(Math.random() * jokes.length);
                message.channel.send(jokes[randomJoke]);
                if(wasCommand)
                    message.delete();
            });
        }
        else {
            request({
                method: 'GET',
                uri: "https://icanhazdadjoke.com/",
                headers: {
                    'Accept': 'text/plain'
                }
            }, function(error, response, body) {
                message.channel.send(body);
                if(wasCommand)
                    message.delete();
            });
        }
    }
}

module.exports = joke;