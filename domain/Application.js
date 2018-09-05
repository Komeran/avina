import {MappedBaseClass} from "./MappedBaseClass";
import {Guild} from "./Guild";
import {User} from "./User";

/**
 * Mapped Application Object
 * @author marc.schaefer
 * @date 27.08.2018
 * @typedef {Object} ColumnMap
 * @property column {string} The column in the database table
 * @property [primaryKey] {boolean} whether the field is a primary key
 * @property [notNull] {boolean} whether null values are allowed for this field. Obsolete if primaryKey is true
 * @property [foreignKey] {MappedBaseClass} marks the column as foreign key identifying another MappedBaseClass
 */
export class Application extends MappedBaseClass {
    static table = "a_applications";

    /**
     *
     * @type {{guildSnowflake: ColumnMap, userSnowflake: ColumnMap, roleSnowflake: ColumnMap}}
     */
    static persistenceMapping = {
        "guildSnowflake": {
            column: "a_g_guild",
            foreignKey: Guild
        },
        "userSnowflake": {
            column: "a_u_user",
            foreignKey: User
        },
        "roleSnowflake": {
            column: "a_r_role",
            foreignKey: Role
        }
    };
}