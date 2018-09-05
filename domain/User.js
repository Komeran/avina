import {MappedBaseClass} from "./MappedBaseClass";

/**
 * Mapped User Object
 * @author marc.schaefer
 * @date 29.08.2018
 * @typedef {Object} ColumnMap
 * @property column {string} The column in the database table
 * @property [primaryKey] {boolean} whether the field is a primary key
 * @property [notNull] {boolean} whether null values are allowed for this field. Obsolete if primaryKey is true
 * @property [foreignKey] {MappedBaseClass} marks the column as foreign key identifying another MappedBaseClass
 */
export class User extends MappedBaseClass {
    /**
     * The name of the table in the database this obejct reflects
     * @type {string}
     */
    static table = "u_users";

    /**
     * The mappings of the object fields to the table columns in the database
     * @type {{snowflake: ColumnMap}}
     */
    static persistenceMapping = {
        "snowflake": {
            column: "u_snowflake",
            primaryKey: true
        }
    };
}