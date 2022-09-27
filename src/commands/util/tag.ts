import { ApplicationCommandOptionType, inlineCode } from "discord.js";
import { Command } from "../../def";

export default new Command({
    name: "tag",
    options: [{
        name: "tag",
        description: "The tag to use",
        required: true,
        autocomplete: true,
        type: ApplicationCommandOptionType.String,
    }],
    description: "Send and modify a tag.",
    handler: async (interaction) => {
        const tag = interaction.options.getString("tag", true);
        await interaction.editReply(tag);
    },
})