import {MappedBaseClass} from "./MappedBaseClass";

/**
 * Mapped DnDQuest Object
 * @author marc.schaefer
 * @date 29.08.2018
 * @implements MappedBaseClass
 */
export class DnDQuest {

    /**
     * The name of the table in the database this obejct reflects
     * @type {string}
     */
    static table = "d1_dndquests";

    /**
     * The mappings of the object fields to the table columns in the database
     * @type {{...string}}
     */
    static persistenceMapping = {
        "dq_id": "id",
        "dq_d_dndgame": "gameId",
        "dq_d_g_guild": "guildSnowflake",

    };
}