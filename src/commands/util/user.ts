import { ApplicationCommandOptionType, TimestampStyles, UserFlagsString, time, inlineCode } from "discord.js";
import { client } from "../..";
import { Command } from "../../def";
import { createStatusEmbed } from "../../lib/embeds";

export function getEmojiFromFlag(flag: UserFlagsString) {
    const emojiCache = client.constants?.guild.emojis.cache;
    const emoji = emojiCache?.find(e => e.name === flag);

    if (flag === "VerifiedBot") return `${emojiCache?.find(e => e.name === "VerifiedBot1")}${emojiCache?.find(e => e.name === "VerifiedBot2")}`;

    return emoji?.toString() ?? inlineCode(flag);
}

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
            color: member?.roles.highest.color || user.accentColor || client.constants!.palette.accent,
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