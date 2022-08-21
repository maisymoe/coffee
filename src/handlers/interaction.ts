import { client } from "..";
import { logError } from "../lib/common";
import { createErrorEmbed } from "../lib/embeds";
import { commands } from "./command";

export default async function interactionHandler() {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = commands.find(i => i.name === interaction.commandName);

        if (!command) { return } else {
            try {
                await interaction.deferReply({ ephemeral: command.ephemeral });

                if (command.su && !client.config.users.includes(interaction.user.id)) {
                    await interaction.editReply({ content: "You do not have permission to use this command" });
                    return;
                }

                await command.handler(interaction);
            } catch (error) {
                const typedError = error as Error;
                // Interaction is dead, no need to reply
                if (typedError.message.includes("Unknown Interaction")) return;

                await logError(interaction, typedError);
                await interaction.editReply({ embeds: [createErrorEmbed({ description: "I ran into an error running that command! I've reported it, and it should be fixed soon." })]});
            }
        }
    })
}