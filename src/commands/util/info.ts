import { time, TimestampStyles } from "discord.js";
import { client } from "../..";
import { Command } from "../../def";
import { createGenericEmbed } from "../../lib/embeds";

export default new Command({
    name: "info",
    description: "Display information about the bot.",
    handler: async (interaction) => {
        const generalFields = [
            { name: "User", value: client.user!.toString(), inline: true },
            { name: "Guilds", value: (await client.guilds.fetch()).size.toString(), inline: true },
            { name: "Users (cached)", value: client.users.cache.size.toString(), inline: true },
            { name: "Created", value: time(client.user!.createdAt, TimestampStyles.LongDateTime), inline: false },
        ]

        if (interaction.inGuild()) generalFields.push({ name: "Joined", value: time(interaction.guild!.joinedAt, TimestampStyles.LongDateTime), inline: false });

        const softwareFields = [
            { name: "Node", value: process.version, inline: true },
            { name: "TypeScript", value: client.package.devDependencies["typescript"], inline: true },
            { name: "Discord.JS", value: client.package.dependencies["discord.js"], inline: true },
        ]

        const embed = createGenericEmbed({
            color: "Blurple",
            title: client.user?.username,
            description: `${(await client.users.fetch(client.config.users[0])).toString()}'s Discord bot.`,
            fields: [
                ...generalFields,
                ...softwareFields,
            ],
            footer: { text: `${client.package.version} - Created with ❤️`}
        });

        await interaction.editReply({ embeds: [embed] });
    },
})