/**
 * @author marcs
 * @date 11.08.2018
 */

let ytclient = require('../ytclient.js');

module.exports = {
    execute: function (args, message) {
        if(!message.guild) {
            message.author.send("This command doesn't work in direct messages!");
            message.delete();
            return;
        }
        if(!message.guild.member(message.author).permissions.has("ADMINISTRATOR")) {
            message.author.send("This is and admin only command! And you are not an admin of this server, sorry!");
            message.delete();
            return;
        }

        let channel = null;
        let channelName = null;
        let stop = false;
        let title = null;
        let is = false;
        let not = false;

        for(let i = 2; i < args.length; i++) {
            if(args[i] === "--stop") {
                stop = true;
                continue;
            }

            if(args[i] === "--title") {
                title = args.subarray(i+3, args.length).join(' ');
                if(args[i+1] === "contains") {
                    if(args[i+2] === "not") {
                        not = true;
                    }
                }
                else if(args[i+1] === "is") {
                    is = true;
                    if(args[i+2] === "not") {
                        not = true;
                    }
                }
                else {
                    message.author.send("Missing contains or is argument for --title!");
                    message.delete();
                    return;
                }
                continue;
            }

            for(; i < args.length; i++) {
                if(args[i].substring(0, 2) === "--") {
                    i--;
                    break;
                }
                channel = (channel || ' ') + args[i];
            }
            channel = channel.substring(1, channel.length);
        }

        let done = function(ytChannelId) {
            if(stop) {
                if (ytChannelId) {
                    ytclient.unsubscribe(channel, message.channel.id, function () {
                        message.channel.send({
                            embed: {
                                title: 'I will no longer let this channel know when ' + channelName + ' uploads videos!',
                                color: 3447003
                            }
                        });
                        message.delete();
                    });
                }
                else {
                    ytclient.unsubscribeAll(message.channel.id, function () {
                        message.channel.send({
                            embed: {
                                title: "I will no longer let this channel know when anyone uploads YouTube videos!",
                                color: 3447003
                            }
                        });
                    });
                }
            }
            if(!channel) {
                message.author.send("Missing channel or --stop argument!");
                message.delete();
                return;
            }
            let notify = function(entry) {
                message.channel.send({
                    embed: {
                        title: entry.author.name + " uploaded " + entry.title + "!",
                        description: "Go watch it here: " + entry.link.href,
                        color: 3447003
                    }
                });
            };
            let cb = notify;
            if(title) {
                cb = function(entry) {
                    if(entry.title.toLowerCase().indexOf(title.toLowerCase()) !== -1) {
                        notify(entry);
                    }
                };
                if(is) {
                    cb = function(entry) {
                        if(entry.title.toLowerCase() === title.toLowerCase()) {
                            notify(entry);
                        }
                    };
                    if(not) {
                        cb = function(entry) {
                            if(entry.title.toLowerCase() !== title.toLowerCase()) {
                                notify(entry);
                            }
                        };
                    }
                }
                else if(not) {
                    cb = function(entry) {
                        if(entry.title.toLowerCase().indexOf(title.toLowerCase()) === -1) {
                            notify(entry);
                        }
                    };
                }
            }
            else {
                cb = notify;
            }
            ytclient.subscribeToYtChannel(channel, message.channel.id, cb, function(err) {
                if(err) {
                    message.author.send("Could not subscribe to the YouTube Channel. Error: " + err);
                    message.delete();
                    return;
                }
                message.channel.send({
                    embed: {
                        title: "I will now notify this channel of uploads from this YouTube channel!",
                        color: 3447003
                    }
                });
            });
        };

        if(channel)
            getChannelId(channel, done);
        else
            done();
    },
    help: ""
};

/*


###################################################### GOOGLE API ######################################################


 */

var fs = require('fs');
var readline = require('readline');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var cs = require('../auth.json').youtube;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'youtube-nodejs-quickstart.json';

// Load client secrets from a local file.
function getChannelId(query, callback) {

    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(cs, getChannel, query, callback);
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, query, finishedCallback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback, query, finishedCallback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            if(callback)
                callback(oauth2Client, query, finishedCallback);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback, query, finishedCallback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            if(callback)
                callback(oauth2Client, query, finishedCallback);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) throw err;
        console.log('Token stored to ' + TOKEN_PATH);
    });
    console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth, query, callback) {
    var service = google.youtube('v3');
    service.channels.list({
        auth: auth,
        part: 'snippet,contentDetails,statistics',
        id: query
    }, function(err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var channels = response.data.items;
        if (channels.length === 0) {
            service.channels.list({
                auth: auth,
                part: 'snippet,contentDetails,statistics',
                forUsername: query
            }, function(err, response) {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return;
                }
                var channels = response.data.items;
                callback(channels[0].snippet.id);
            });
        } else {
            callback(channels[0].snippet.id);
        }
    });
}