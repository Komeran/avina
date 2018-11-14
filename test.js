/**
 * @author marc.schaefer
 * @date 14.11.2018
 */

let mysqlConfig = require("./config.json").database || {
    "host": "127.0.0.1",
    "user": "avina",
    "password": "",
    "database": "Avina"
};
let mysql = require('mysql');
let dbConnection = mysql.createConnection(mysqlConfig);

console.log("Connecting to database...");

dbConnection.connect(function(err) {
    if(err) {
        console.log(err);
        return;
    }
    console.log("Successfully connected to database!");

    console.log("Testing...");

    query("SELECT * FROM t_textchannels WHERE t_g_guild = '345628365337657345' AND t_welcomeMessage IS NOT NULL;").then(function(results) {
        if(results) {
            //let channels = [];
            results.forEach(function(channel) {
                console.log(channel.welcomeMessage);
                //channels.push(new TextChannel(channel.t_snowflake, channel.t_welcomeMessage, tinyIntToBool(channel.t_ignorecommands), tinyIntToBool(channel.t_updatewarframeversion), tinyIntToBool(channel.t_notifywarframealerts), channel.t_g_guild));
            });
            return;
        }
        console.log("No results!");
    }).catch(console.error);
});

let query = function(queryString) {
    return new Promise(resolve => dbConnection.query(queryString, function(error, result, fields) {
        if(result && result[0]) {
            resolve(result);
            return;
        }
        if(error) {
            resolve(error);
        }
        resolve();
    }));
};

