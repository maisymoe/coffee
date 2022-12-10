import { ChatInputCommandInteraction, codeBlock, cleanCodeBlockContent } from "discord.js";
import { createStatusEmbed } from "./embeds";
import { client } from "../";

export async function logError(interaction: ChatInputCommandInteraction, error?: Error, message?: string) {
    console.error(error);
    const errorEmbed = createStatusEmbed({
        type: error ? "error" : "warn",
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
        ],
    });

    if (message) errorEmbed.setDescription(message);

    if (error) {
        errorEmbed.addFields({
            name: "Error",
            value: codeBlock("js", cleanCodeBlockContent((error.stack || error.message || error.toString()).substring(0, 1000))),
            inline: false,
        });
    }

    client.constants?.channels.log.send({ embeds: [errorEmbed] });
}