import { ApplicationCommandData, ApplicationCommandType, CommandInteraction, codeBlock } from "discord.js";
import { client } from "..";
import { Command } from "../def";
import { createErrorEmbed } from "./embeds";

export function convertToDiscordCommands(commands: Command[]) {
    const convertedCommands = [];

    for (const command of commands) {
        convertedCommands.push({
            name: command.name,
            description: command.description,
            options: command.options,
            type: ApplicationCommandType.ChatInput,
        } as ApplicationCommandData);
    }

    return convertedCommands;
}

export async function logError(interaction: CommandInteraction, error: Error) {
    console.error(error);

    const logChannel = await client.channels.fetch(client.config.channels.log);
    const errorEmbed = createErrorEmbed({
        fields: [
            {
                name: "Command",
                value: codeBlock(`/${interaction.commandName} ${interaction.options.data.map(o => `${o.name}:${o.value}`).join(" ")}`.substring(0, 1000)),
                inline: false,
            },
            {
                name: "User",
                value: interaction.user.toString(),
                inline: true,
            },
            {
                name: "Guild",
                value: interaction.inGuild() ? `${interaction.guild?.name} (${interaction.guild?.id})` : "DM",
                inline: true,
            },
            {
                name: "Error",
                value: codeBlock("js", (error.stack || error.message || error.toString()).substring(0, 1000)),
                inline: false,
            }
        ],
    });

    logChannel?.isTextBased() && logChannel?.send({ embeds: [errorEmbed] });
}