import { ApplicationCommandOptionType } from "discord.js";
import { client } from "../..";
import { Command } from "../../def";

export default new Command({
    name: "config",
    options: [{
        name: "item",
        description: "The item to get",
        required: true,
        type: ApplicationCommandOptionType.String,
    }],
    description: "config stuff",
    handler: async (interaction) => {
        const item = client.config.ghost[interaction.options.get("item", true).value!.toString()];

        if (item) {
            await interaction.editReply({ content: item.toString() });
        } else {
            await interaction.editReply({ content: "Item not found" });
        }
    },
})