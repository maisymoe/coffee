import { Command } from "../../lib/def";
import { CommandInteraction } from "discord.js";

import tags from "../../../data/tags.json";
import { reply } from "../../lib/common";

export default new Command({
    name: "tag",
    description: "Send a message with a given tag",
    devOnly: true,
    options: [
        {
            name: "tag",
            description: "The tag you wish to send",
            type: "STRING",
            autocomplete: true,
            required: true,
        },
    ],
    callback: async (interaction: CommandInteraction) => {
        return reply(interaction, { content: tags.find(tag => tag.name === interaction.options.getString("tag"))?.response });
    }
});