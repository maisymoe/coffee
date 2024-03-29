import { client } from "..";

export default async function tagsHandler() {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isAutocomplete()) return;
        const focused = interaction.options.getFocused();

        try {
            if (interaction.inGuild()) {
                const filteredTags = client.constants?.tags.filter(t => t.guildId === interaction.guild?.id && t.name.startsWith(focused));
                await interaction.respond(filteredTags?.map(t => ({ name: t.name, value: t.name })) || []);
            } else {
                await interaction.respond([]);
            }
        } catch(error) {
            const typedError = error as Error;
            // Interaction is dead, no need to reply
            if (typedError.message.toLowerCase().includes("unknown interaction")) return;
        }
    });
}