import { ApplicationCommandOptionType, TextBasedChannel } from "discord.js";
import { Subcommand } from "../../../def";
import { createStatusEmbed } from "../../../lib/embeds";

export default new Subcommand({
    name: "channel",
    description: "Send a message to a channel",
    options: [
        {
            name: "content",
            description: "The content of the message",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "channel",
            description: "The channel to message",
            type: ApplicationCommandOptionType.Channel,
        },
        {
            name: "attachment",
            description: "An optional attachment to send to the user",
            type: ApplicationCommandOptionType.Attachment,
        }
    ],
    handler: async (interaction) => {
        const channel = interaction.options.getChannel("channel") as TextBasedChannel || interaction.channel;
        const content = interaction.options.getString("content", true);
        const attachment = interaction.options.getAttachment("attachment");

        let embed;

        try {
            await channel.send({ content: content, files: attachment ? [attachment] : undefined });
            embed = createStatusEmbed({
                type: "success",
                description: `${channel.toString()} was messaged successfully!`,
            });
        } catch {
            embed = createStatusEmbed({
                type: "error",
                description: `${channel.toString()} could not be messaged.`,
                footer: { text: "Is the channel text-based?" },
            })
        }

        await interaction.editReply({ embeds: [embed] });
    }
})