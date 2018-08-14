/**
 * @author marc.schaefer
 * @date 13.08.2018
 */

/*
let path = require('path');
let itemIconLinks = {};
let parsedItems = {};
//region
let query = "Cr";
let creditsImage = "https://vignette.wikia.nocookie.net/warframe/images/0/01/CreditsLarge.png";
require('request-promise')("http://content.warframe.com/MobileExport/Manifest/ExportManifest.json").then(function(data) {
    let Items = require('warframe-items');
    let items = new Items();
    parsedItems = {};
    items.forEach(function(item) {
        parsedItems[item.name] = item;
        console.log(item.name);
    });
    data = JSON.parse(data)["Manifest"];
    for(let i in data) {
        data[i].textureLocation = path.join("http://content.warframe.com/MobileExport", data[i].textureLocation);
        if(parsedItems[query] && data[i].uniqueName === parsedItems[query].uniqueName) {
            console.log(data[i].textureLocation);
        }
    }
});
//endregion*/

let Discord = require('discord.js');

let client = new Discord.Client();
let auth = require('./auth.json');

client.login(auth.token);

client.on("ready", function() {
    client.guilds.get("246407562461708289").channels.get("477920496567189519").send({
        embed: {
            title: "DOMT 1" ,
            color: 0xF96221,
            thumbnail: "attachment://domt1"
        },
        files: [
            {
                attachment: './domt/1.png',
                name: 'domt1'
            }
        ]
    });
});