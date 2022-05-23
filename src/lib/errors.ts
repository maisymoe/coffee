import { CommandInteraction, TextChannel } from "discord.js";
import { client } from "..";
import { createStatusEmbed } from "./embeds";
import { reply } from "./common";

export async function handleError(interaction: CommandInteraction, error: Error) {
    const logChannel = await client.channels.fetch(client.config.logging.errors) as TextChannel;

    const reportedErrorEmbed = createStatusEmbed("error", undefined, [
        {
            name: "Command",
            value: interaction.commandName,
            inline: true,
        },
        {
            name: "Guild",
            value: `${interaction.guild?.name} (${interaction.guild?.id})`,
            inline: true,
        },
        {
            name: "User",
            value: interaction.user.tag,
            inline: true,
        },
        {
            name: "Error",
            value: ` \`\`\`js\n${error.stack ? error.stack : error.toString()}\`\`\``
        }
    ]);

    const presentedErrorEmbed = createStatusEmbed("error", `Something went wrong when running \`${interaction.commandName}\`! The error has been reported, and we'll get right on it.`);

    logChannel.send({ embeds: [reportedErrorEmbed] });
    reply(interaction, { embeds: [presentedErrorEmbed] });
}