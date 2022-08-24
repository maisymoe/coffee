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
                if (!command.noAck) {
                    await interaction.deferReply({ ephemeral: command.ephemeral });
                }

                if (command.su && !client.config.users.includes(interaction.user.id)) {
                    await interaction[command.noAck ? "reply" : "editReply"]({ embeds: [createErrorEmbed({ 
                                description: `${interaction.user.username} is not in the sudoers file. This incident will be reported.`,
                                footer: { text: client.insults![Math.floor(Math.random() * client.insults!.length)]
                            } 
                        })],
                        ephemeral: command.ephemeral
                    });
                    return;
                }

                await command.handler(interaction);
            } catch (error) {
                const typedError = error as Error;
                // Interaction is dead, no need to reply
                if (typedError.message.toLowerCase().includes("unknown interaction")) return;

                await logError(interaction, typedError);
                await interaction[command.noAck ? "reply" : "editReply"]({ embeds: [createErrorEmbed({ description: "I ran into an error running that command! I've reported it, and it should be fixed soon." })]});
            }
        }
    })
}