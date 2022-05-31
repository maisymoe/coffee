import { Command } from "../../lib/def";
import { CommandInteraction, MessageEmbed } from "discord.js";

import { createStatusEmbed } from "../../lib/embeds";
import { reply } from "../../lib/common";

export default new Command({
    name: "dm",
    description: "DMs a user - only available to developers!",
    su: true,
    ephemeral: true,
    options: [
        {
            name: "user",
            description: "The user to DM.",
            type: "USER",
            required: true,
        },
        {
            name: "content",
            description: "The content to DM the user.",
            type: "STRING",
            required: true,
        },
        {
            name: "attachment",
            description: "An optional attachment to DM the user.",
            type: "ATTACHMENT",
        }
    ],
    callback: async (interaction: CommandInteraction) => {
        let embed: MessageEmbed;
        
        const user = interaction.options.getUser("user", true);
        const content = interaction.options.getString("content", true);
        const attachment = interaction.options.getAttachment("attachment");

        try {
            await user.send({ content: content, files: attachment ? [attachment] : undefined });
            embed = createStatusEmbed("success", `${user?.tag} was messaged successfully.`);
        } catch (e) {
            embed = createStatusEmbed("error", `${user?.tag} could not be messaged.`);
        }

        return await reply(interaction, { embeds: [embed] });
    }
});
