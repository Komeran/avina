/**
 * Abstract BaseContinuous class which all Discord API event listeners derive from
 * @author marc.schaefer
 * @date 14.11.2018
 */
class BaseContinuous {
    /**
     *
     * @param on {string} The Discord API event that triggers the execute function
     * @abstract
     */
    constructor(on) {
        this.on = on || "";
    }

    /**
     * Function to be executed when the associated Discord API event was fired
     * @abstract
     */
    execute() {
        throw new Error("abstract function yo");
    }
}

module.exports = BaseContinuous;