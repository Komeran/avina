/**
 * @author marc.schaefer
 * @date 13.08.2018
 */

let path = require('path');
let itemIconLinks = {};
require('request-promise')("http://content.warframe.com/MobileExport/Manifest/ExportManifest.json").then(function(data) {
    data = JSON.parse(data)["Manifest"];
    for(let i in data) {
        data[i].textureLocation = path.join("http://content.warframe.com/MobileExport", data[i].textureLocation);
        data[i].uniqueName = data[i].uniqueName.split('/')[data[i].uniqueName.split('/').length-1];
        if(data[i].uniqueName === "OberonOryxHelmetBlueprint")
            console.log(data[i].textureLocation);
    }
});