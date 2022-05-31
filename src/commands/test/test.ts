import { Command } from "../../lib/def";
import { CommandInteraction } from "discord.js";

import { reply } from "../../lib/common";

export default new Command({
    name: "test",
    description: "A test command",
    devOnly: true,
    // ignoreAck: true,
    ephemeral: true,
    options: [
        {
            name: "string",
            description: "a test",
            type: "STRING",
            required: true,
        },
    ],
    callback: async (interaction: CommandInteraction) => {
        return reply(interaction, { content: `You said ${interaction.options.getString("string", true)}` });
    }
});