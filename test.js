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
let pubSubSubscriber = pubSubHubbub.createServer({callbackUrl: "http://68.66.241.33:8081"});
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
        }
        else {
            console.log(">>> Feed Object:", result.feed);
            if (!result.feed.entry || !result.feed.entry[0])
                return;
            let entry = result.feed.entry[0];
            let ytChannelId = entry["yt:channelId"][0];
            console.log(">>> Channel ID:", ytChannelId);
            let author = entry["author"][0].name[0];
            console.log(">>> Author:", author);
            let videoLink = entry["link"][0].$.href;
            console.log(">>> Link:", videoLink);
            let videoTitle = entry["title"][0];
            console.log(">>> Title:", videoTitle);
        }
        pubSubSubscriber.unsubscribe(config.topic + "?channel_id=" + args[0], config.hub, function(err) {
            if(!err) {
                console.log("Successfully unsubscribed from " + args[0]);
            }
            else {
                console.log(err);
            }
        });
    });
});

pubSubSubscriber.listen(8081);

pubSubSubscriber.subscribe(config.topic + "?channel_id=" + args[0], config.hub, function (err) {
    if (!err) {
        console.log("Successfully subscribed to " + args[0]);
    }
    else {
        console.log(err);
    }
});