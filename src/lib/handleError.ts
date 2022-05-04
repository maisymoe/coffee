import { CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import { client } from "..";

export default async function(interaction: CommandInteraction, error: Error) {
    const logChannel = await client.channels.fetch(client.config.logging.errors) as TextChannel;

    const reportedErrorEmbed = new MessageEmbed({
        color: client.config.cosmetics.palette.error,
        fields: [
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
        ],
    })

    const presentedErrorEmbed = new MessageEmbed({
        description: `Something went wrong when running ${interaction.commandName}! The error has been reported, and we'll get right on it.`,
        color: client.config.cosmetics.palette.error,
    });

    logChannel.send({ embeds: [reportedErrorEmbed] });
    interaction.editReply({ embeds: [presentedErrorEmbed] });
}