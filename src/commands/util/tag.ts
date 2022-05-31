import { Command } from "../../lib/def";
import { CommandInteraction } from "discord.js";
import { reply } from "../../lib/common";

import { client } from "../..";

export default new Command({
    name: "tag",
    description: "Send a message with a given tag",
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
        const globalTags = client.tags.filter(t => !t.guildId);
        const availableTags = globalTags.concat(client.tags.filter(t => t.guildId === interaction.guildId));

        return reply(interaction, { content: availableTags.find(tag => tag.name === interaction.options.getString("tag", true))?.response });
    }
});