/**
 * MappedBaseClass
 * @author marc.schaefer
 * @date 27.08.2018
 * @typedef {Object} ColumnMap
 * @property column {string} The column in the database table
 * @property [primaryKey] {boolean} whether the field is a primary key
 * @property [notNull] {boolean} whether null values are allowed for this field. Obsolete if primaryKey is true
 * @property [foreignKey] {MappedBaseClass} marks the column as foreign key identifying another MappedBaseClass
 */
export class MappedBaseClass {
    /**
     * @param args {{}}
     */
    constructor(args) {
        if(new.target === MappedBaseClass)
            throw new Error("Abstract Class yo");
        for(let map in new.target.persistenceMapping) {
            this[map] = args[map];
            if((new.target.persistenceMapping[map].primaryKey || new.target.persistenceMapping[map].notNull) && (args[map] === null || args[map] === undefined))
                throw new Error(map + " can not be null and must be provided!");
            if(new.target.persistenceMapping[map].foreignKey) {
                this["get" + map.charAt(0).toUpperCase() + map.substring(1, map.length)] = new Function("return ");
            }
        }
    }

    /**
     * The mappings for variables of this class to the columns of the table in the database this object reflects
     * @type {{...ColumnMap}}
     * @example
     * {
     *   id: {
     *       column: "m_id",
     *       primaryKey: true
     *   },
     *   "someValue": {
     *       column: "m_val",
     *       notNull: true
     *   }
     * }
     */
    static persistenceMapping = {};

    /**
     * The table name of the table in the database this object reflects
     * @type {string}
     */
    static table;
}