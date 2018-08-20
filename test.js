/**
 * @author marc.schaefer
 * @date 13.08.2018
 */

let path = require('path');
let parsedItems = {};

let imageCachePath = "imgCache";
let resizedImageCachePath = "imgCache/resized";
let fs = require('fs'),
    request = require('request'),
    sharp = require('sharp');
let args = process.argv.slice(2);

let pubSubHubbub = require("pubsubhubbub");
let pubSubSubscriber = pubSubHubbub.createServer({callbackUrl: "http://68.66.241.33:8080"});
let config = require("./config.json").googleapi.subscribe;
let parseString = require('xml2js').parseString;

pubSubSubscriber.on("listen", function(){
    console.log("Listening on port %s", pubSubSubscriber.port);
});

pubSubSubscriber.on("feed", function(data) {
    console.log(">>> XML:", data.feed.toString());
    parseString(data.feed.toString(), function(err, result) {
        if(err) {
            console.log(">>>>> INVALID FEED XML <<<<<");
            return
        }
        console.log(">>> Feed Object:", result.feed);
        let ytChannelId = result.feed.entry["yt:channelId"];
        console.log(">>> Channel ID:", ytChannelId);
    });
    pubSubSubscriber.unsubscribe(config.topic + "?channel_id=" + args[0], config.hub, function(err) {
        if(!err) {
            console.log("Successfully unsubscribed from " + args[0]);
        }
        else {
            console.log(err);
        }
    });
});

pubSubSubscriber.listen(config.port);

pubSubSubscriber.subscribe(config.topic + "?channel_id=" + args[0], config.hub, function (err) {
    if (!err) {
        console.log("Successfully subscribed to " + args[0]);
    }
    else {
        console.log(err);
    }
});

/*
let download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
        if(err) {
            console.error(err);
            return;
        }
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        if(!fs.existsSync(__dirname + '/' + imageCachePath)) {
            fs.mkdirSync(__dirname + '/' + imageCachePath);
        }

        request(uri).pipe(fs.createWriteStream(path.join(imageCachePath, filename))).on('close', callback);
    });
};

//region Stuff

let Discord = require('discord.js');

let client = new Discord.Client();
let auth = require('./auth.json');
let manifest = null;

client.login(auth.token);

client.on("ready", function() {
    require('request-promise')("http://content.warframe.com/MobileExport/Manifest/ExportManifest.json").then(function (data) {
        manifest = JSON.parse(data)["Manifest"];
    });
});

client.on("message", function(message) {
    if(message.author.id !== client.user.id) {
        sendImage(message.content, message.channel);
    }
});

let query = "Cr";
let creditsImage = "https://vignette.wikia.nocookie.net/warframe/images/0/01/CreditsLarge.png";

function attachThumbnailToEmbed(embed, thumbnail) {
    embed.thumbnail = {
        url: "attachment://" + thumbnail
    };
    return embed;
}

function sendImageMessage(thumbnail, itemName, channel) {
    let embed = {
        title: itemName
    };
    channel.send({
        embed: attachThumbnailToEmbed(embed, thumbnail),
        files: [
            {
                attachment: path.join(resizedImageCachePath, thumbnail),
                name: thumbnail
            }
        ]
    });
}

function sendImage(item, channel) {
    let query = item;
    let Items = require('warframe-items');
    let items = new Items();
    parsedItems = {};
    items.forEach(function (item) {
        parsedItems[item.name] = item;
    });
    console.log(parsedItems["Rubedo"]);
    for (let i in manifest) {
        manifest[i].textureLocation = "http://" + path.join("content.warframe.com/MobileExport", manifest[i].textureLocation);
        let imgfile = manifest[i].uniqueName.split('/')[manifest[i].uniqueName.split('/').length - 1] + '.png';
        if(!Object.values(parsedItems).find(element => element.uniqueName === manifest[i].uniqueName))
            continue;
        let itemName = Object.values(parsedItems).find(element => element.uniqueName === manifest[i].uniqueName).name;
        if(itemName.toLowerCase() !== query.toLowerCase())
            continue;
        if (!fs.existsSync(__dirname + '/' + resizedImageCachePath + '/' + imgfile)) {
            download(manifest[i].textureLocation, imgfile, function () {
                if (!fs.existsSync(__dirname + '/' + resizedImageCachePath)) {
                    fs.mkdirSync(__dirname + '/' + resizedImageCachePath);
                }
                sharp(path.join(imageCachePath, imgfile))
                    .resize(512, 342, {
                        kernel: sharp.kernel.nearest
                    })
                    .ignoreAspectRatio()
                    .toFile(path.join(resizedImageCachePath, imgfile), function (err) {
                        if(err) {
                            console.error(err);
                            return;
                        }
                        sendImageMessage(imgfile, itemName, channel);
                        fs.rmdir(path.join(imageCachePath, imgfile), function(err) {
                            if(err) {
                                console.log(err);
                                return;
                            }
                            console.log("DoNe");
                        });
                    });
            });
        }
        else {
            sendImageMessage(imgfile, itemName, channel);
        }
        break;
    }
    console.log("DONE");
}
//endregion*/