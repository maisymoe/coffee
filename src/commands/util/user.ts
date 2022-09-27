import { ApplicationCommandOptionType, time, TimestampStyles } from "discord.js";
import { client } from "../..";
import { Command } from "../../def";
import { getEmojiFromFlag } from "../../lib/common";
import { createStatusEmbed } from "../../lib/embeds";

export default new Command({
    name: "user",
    options: [{
        name: "user",
        description: "The user to get info for",
        type: ApplicationCommandOptionType.User,
    }],
    description: "Display information about a given user.",
    handler: async (interaction) => {
        const givenUser = interaction.options.getUser("user") ?? interaction.user;

        let user = await client.users.fetch(givenUser.id, { force: true });
        let member;

        if (interaction.inGuild()) {
            try {
                member = await interaction.guild!.members.fetch(user);
            } catch(e) {
                member = null;
            }
        }

        const userFlags = user.flags?.toArray() ?? [];

        const generalFields = [
            { name: "Mention", value: user.toString(), inline: true },
            { name: "ID", value: user.id, inline: true },
            { name: "Flags", value: userFlags.length > 0 ? userFlags.map(f => getEmojiFromFlag(f)).join(" ") : "None", inline: false },
            { name: "Created", value: time(user.createdAt, TimestampStyles.LongDateTime), inline: false },
        ]

        if (member) {
            generalFields.push({ name: "Joined", value: time(member.joinedAt!, TimestampStyles.LongDateTime), inline: false });
        }

        const embed = createStatusEmbed({
            type: "info",
            color: member?.roles.highest.color || user.accentColor || "Blurple",
            title: user.tag,
            fields: [
                ...generalFields,
            ]
        });

        embed.setThumbnail(user.displayAvatarURL());

        if (user.bannerURL()) {
            embed.setImage(user.bannerURL({ size: 4096 })!);
        };

        await interaction.editReply({ embeds: [embed] });
    },
})