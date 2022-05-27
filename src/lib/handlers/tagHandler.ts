import tags from "../../../data/tags.json";
import { client } from "../..";
import { Interaction } from "discord.js";

export default async function() {
    client.on("interactionCreate", async(interaction: Interaction) => {
        if (!interaction.isAutocomplete() || interaction.commandName !== "tag") return;
        const focusedValue = interaction.options.getFocused();

        const tagsToSend = tags.filter(tag => tag.name.startsWith(focusedValue.toString()));

        await interaction.respond(tagsToSend.map(tag => ({ name: tag.name, value: tag.name })));
    })
}