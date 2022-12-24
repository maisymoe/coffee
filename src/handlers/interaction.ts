import { ChatInputCommandInteraction, InteractionReplyOptions } from "discord.js";
import { client } from "..";
import { logError } from "../lib/errors";
import { createStatusEmbed } from "../lib/embeds";
import { commands } from "./command";
import { Command } from "../def";

export const safeReply = async (command: Command, interaction: ChatInputCommandInteraction, reply: InteractionReplyOptions) => await interaction[command.noAck ? "reply" : "editReply"](reply);

export default async function interactionHandler() {
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isChatInputCommand()) return;
        if (client.config.blacklist.includes(interaction.user.id)) {
            interaction.reply({
                embeds: [
                    createStatusEmbed({
                        type: "error",
                        description: "You have been blacklisted from Coffee."
                    }),
                ] 
            });
            return;
        }

        const command = commands.find(i => i.name === interaction.commandName);
        if (!command) return;

        try {
            if (!command.noAck) await interaction.deferReply({ ephemeral: command.ephemeral });

            if (command.su && !client.config.users.includes(interaction.user.id)) {
                await safeReply(command, interaction, { 
                    embeds: [createStatusEmbed({
                        type: "error",
                        description: `${interaction.user.username} is not in the sudoers file. This incident will be reported.`, 
                        footer: { text: client.constants!.insults![Math.floor(Math.random() * client.constants!.insults!.length)] },
                    })],
                    ephemeral: command.ephemeral
                });
                return;
            }

            if (command.handler instanceof Function) { 
                await command.handler(interaction);
            } else {
                const subcommand = command.handler.find(i => i.name === interaction.options.getSubcommand(true));
                await subcommand!.handler(interaction);
            }
        } catch (error) {
            const typedError = error as Error;
            // Interaction is dead, no need to reply
            if (typedError.message.toLowerCase().includes("unknown interaction")) {
                await logError(interaction, undefined, "An interaction failed...");
                return;
            };

            await logError(interaction, typedError);
            await safeReply(command, interaction, {
                embeds: [
                    createStatusEmbed({
                        type: "error",
                        description: "I ran into an error running that command! I've reported it, and it should be fixed soon.",
                    }),
                ]
            });
        }
    })
}