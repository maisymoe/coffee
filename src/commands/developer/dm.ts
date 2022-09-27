import { ApplicationCommandOptionType } from "discord.js";
import { Command } from "../../def";
import { createStatusEmbed } from "../../lib/embeds";

export default new Command({
    name: "dm",
    description: "DMs a user - for developers!",
    su: true,
    ephemeral: true,
    options: [
        {
            name: "user",
            description: "The user to DM",
            type: ApplicationCommandOptionType.User,
            required: true,
        },
        {
            name: "content",
            description: "The content of the message",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "attachment",
            description: "An optional attachment to send to the user",
            type: ApplicationCommandOptionType.Attachment,
        }
    ],
    handler: async (interaction) => {
        const user = interaction.options.getUser("user", true);
        const content = interaction.options.getString("content", true);
        const attachment = interaction.options.getAttachment("attachment");

        let embed;

        try {
            await user.send({ content: content, files: attachment ? [attachment] : undefined });
            embed = createStatusEmbed({
                type: "success",
                description: `${user.toString()} was messaged successfully!`,
            });
        } catch {
            embed = createStatusEmbed({
                type: "error",
                description: `${user.toString()} could not be messaged.`,
            })
        }

        await interaction.editReply({ embeds: [embed] });
    },
})