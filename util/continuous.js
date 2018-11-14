/**
 * @author marc.schaefer
 * @date 14.11.2018
 */

const BaseContinuous = require("./continuous/BaseContinuous");

let fs = require('fs');
let path = require('path');
let logger = require('winston');

let normalizedPath = path.join(__dirname, "../continuous");
logger.info("Loading continuous Discord API listeners...");
let listeners = {};
let lisCount = 0;

/**
 * Removes the first instance of the target from the array
 * @param target {Object} The target to remove from the array
 * @return {boolean} - true if the target was found and could be removed, false otherwise
 */
Array.prototype.remove = function(target) {
    for(let i = 0; i < this.length; i++) {
        if(this[i] === target) {
            this.splice(i, 1);
            return true;
        }
    }
    return false;
};

/**
 * Removes all instances of the target from the array
 * @param target {Object} The target to remove from the array
 * @return {boolean} - true if the target was found and could be removed, false otherwise
 */
Array.prototype.removeAll = function(target) {
    let lastRemove = true;
    let worked = false;
    while(lastRemove) {
        lastRemove = this.remove(target);
        if(!worked && lastRemove)
            worked = true;
    }
    return worked;
};

/**
 *
 * @param event {string} The Event that fired
 * @param args {Object} All Event parameters
 * @static
 */
const executeListeners = function(event, ...args) {
    try {
        if (!listeners[event] || listeners[event].length === 0)
            return;
        listeners[event].forEach(function (listener) {
            listener.execute(...args);
        });
    }
    catch(e) {
        logger.error(e);
    }
};

/**
 *
 * @param listener {BaseContinuous|string} The listener to be removed
 * @return {boolean} Whether the listener could be removed
 * @static
 */
function removeListener(listener) {
    if(typeof listener === "string") {
        let found = false;
        Object.keys(listeners).forEach(function(key) {
            for(let i = 0; i < listeners[key].length; i++) {
                if(listeners[key][i].constructor.name.toLowerCase() === listener.toLowerCase()) {
                    listeners[key].splice(i, 1);
                    i--;
                    found = true;
                }
            }
        });
        return found;
    }
    let event = listener.on;
    if(listeners[event] && listeners[event].length)
        return listeners[event].removeAll(listener);
    return false
}

initDirectory();

/**
 * @static
 */
function initDirectory() {
    fs.readdirSync(normalizedPath).forEach(function(file) {
        let listenerClass = require(path.join(normalizedPath, file));
        if(listenerClass && listenerClass.prototype && listenerClass.prototype instanceof BaseContinuous) {
            let listener = new listenerClass();
            if(!listeners[listener.on]) {
                listeners[listener.on] = [];
            }
            let listenerExists = false;
            listeners[listener.on].forEach(function(l) {
                if(l instanceof listenerClass) {
                    listenerExists = true;
                }
            });
            if(!listenerExists) {
                listeners[listener.on].push(listener);
                logger.debug("Loaded continuous behaviour [" + file.substring(0, file.length-3) + "]");
            }
            lisCount++;
            return;
        }
        logger.warn(file + " is not a valid continuous behaviour file!");
    });
    logger.info("Loaded " + lisCount + " continuous behaviours.");
}

fs.watch(normalizedPath, { recursive:true }, function(eventType,fileName) {
    if(!fileName) {
        return;
    }
    let existed = removeListener(fileName.substring(0, file.length-3));
    delete require.cache[path.join(normalizedPath, fileName)];
    if(fs.existsSync(path.join(normalizedPath, fileName))) {
        let listenerClass = require(path.join(normalizedPath, file));
        if (listenerClass && listenerClass.prototype && listenerClass.prototype instanceof BaseContinuous) {
            let listener = new listenerClass();
            if(!listeners[listener.on]) {
                listeners[listener.on] = [];
            }
            let listenerExists = false;
            listeners[listener.on].forEach(function(l) {
                if(l instanceof listenerClass) {
                    listenerExists = true;
                }
            });
            if(!listenerExists) {
                listeners[listener.on].push(listener);
                logger.debug("Loaded continuous behaviour [" + fileName.substring(0, file.length-3) + "]");
            }
            lisCount++;
            return;
        }
        else {
            logger.warn(fileName + " is not a valid continuous behaviour file!");
        }
    }
    if(existed) {
        logger.warn("Continuous Behaviour was unloaded: [" + fileName.substring(0, file.length - 3) + "]");
    }
}.bind(this));

module.exports = {
    listeners: listeners,
    /**
     *
     * @param event {string} The Event that fired
     * @param args {Object} All Event parameters
     */
    executeListeners: function(event, ...args) {
        return executeListeners(event, ...args);
    }
};
