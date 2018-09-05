import {MappedBaseClass} from "./MappedBaseClass";
import {User} from "./User";

/**
 * Mapped DnDPlayer Object
 * @author marc.schaefer
 * @date 31.08.2018
 * @typedef {Object} ColumnMap
 * @property column {string} The column in the database table
 * @property [primaryKey] {boolean} whether the field is a primary key
 * @property [notNull] {boolean} whether null values are allowed for this field. Obsolete if primaryKey is true
 * @property [foreignKey] {MappedBaseClass} marks the column as foreign key identifying another MappedBaseClass
 */
export class DnDPlayer extends MappedBaseClass {
    /**
     * The name of the table in the database this obejct reflects
     * @type {string}
     */
    static table = "dp_dndplayers";

    /**
     * The mappings of the object fields to the table columns in the database
     * @type {{...ColumnMap}}
     */
    static persistenceMapping = {
        "userSnowflake": {
            primaryKey: true,
            foreignKey: User
        }
    };
}