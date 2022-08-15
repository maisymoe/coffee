import { client } from "..";
import { commands } from "./command";

export default async function interactionHandler() {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;

        const command = commands.find(i => i.name === interaction.commandName);

        if (!command) { return } else {
            try {
                await interaction.deferReply({ ephemeral: command.ephemeral });

                if (command.su && !client.config.ghost.users.includes(interaction.user.id)) {
                    await interaction.editReply({ content: "You do not have permission to use this command" });
                    return;
                }

                await command.handler(interaction);
            } catch (error) {
                const typed = error as Error;
                // Interaction is dead, no need to reply
                if (typed.message.includes("Unknown Interaction")) return;
                console.error(typed);
            }
        }
    })
}