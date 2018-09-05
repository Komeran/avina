import {MappedBaseClass} from "./MappedBaseClass";
import {Guild} from "./Guild";

/**
 * Mapped DnDGame Object
 * @author marc.schaefer
 * @date 27.08.2018
 * @typedef {Object} ColumnMap
 * @property column {string} The column in the database table
 * @property [primaryKey] {boolean} whether the field is a primary key
 * @property [notNull] {boolean} whether null values are allowed for this field. Obsolete if primaryKey is true
 * @property [foreignKey] {MappedBaseClass} marks the column as foreign key identifying another MappedBaseClass
 */
export class DnDGame extends MappedBaseClass {
    /**
     *
     * @type {{...ColumnMap}}
     */
    static persistenceMapping = {
        "id": {
            column: "d_id",
            primaryKey: true
        },
        "guildSnowflake": {
            column: "d_g_guild",
            foreignKey: Guild,
            notNull: true
        },
        "name": {
            column: "d_name",
            notNull: true
        },
        "dungeonMasterSnowflake": {
            column: "d_dp_u_dungeonmaster",
            foreignKey: DnDPlayer,
            notNull: true
        },
        "playerMax": {
            column: "d_playermax"
        }
    };

    /**
     *
     * @type {string}
     */
    static table = "d_dndgames";
}