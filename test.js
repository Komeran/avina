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

    let testString = encodeURI("Test String 🇬");

    console.log("Setting to:", testString);

    query("UPDATE t_textchannels SET t_welcomeMessage = '" + testString + "' WHERE t_snowflake = '478920624509550602';").then(function() {
        query("SELECT * FROM t_textchannels WHERE t_snowflake = '478920624509550602';").then(function(results) {
            if(results) {
                results.forEach(function(channel) {
                    let wmsg = decodeURI(channel.t_welcomeMessage);
                    console.log("Welcome Message:", wmsg, "[" + wmsg.length + "]");
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

