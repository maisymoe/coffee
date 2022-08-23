import { ApplicationCommandOptionType, codeBlock, cleanCodeBlockContent } from "discord.js";
import { client } from "../..";
import { Command } from "../../def";
import { createGenericEmbed, createErrorEmbed } from "../../lib/embeds";

const AsyncFunction = (async function () {}).constructor;

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
            embed = createGenericEmbed({ color: "Green", description: `${user.toString()} was message successfully!` })
        } catch {
            embed = createErrorEmbed({ description: `${user.toString()} could not be messaged.` })
        }

        await interaction.editReply({ embeds: [embed] });
    },
})