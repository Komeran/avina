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

    console.log("Setting to: 🇬");

    query("UPDATE t_textchannels SET t_welcomeMessage = '🇬' WHERE t_snowflake = '478920624509550602';").then(function() {
        query("SELECT * FROM t_textchannels WHERE t_snowflake = '478920624509550602';").then(function(results) {
            if(results) {
                results.forEach(function(channel) {
                    console.log("Welcome Message:", channel.t_welcomeMessage, "[" + channel.t_welcomeMessage.length + "]");
                });
                return;
            }
            console.log("No results!");
        }).catch(console.error);
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

