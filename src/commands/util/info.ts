import { ApplicationCommandOptionType, hyperlink, time, TimestampStyles } from "discord.js";
import { client } from "../..";
import { Command } from "../../def";
import { createGenericEmbed } from "../../lib/embeds";
import { getGitInfo } from "../../lib/common";
import os from "os";

export default new Command({
    name: "info",
    options: [{
        name: "detailed",
        description: "Show detailed information",
        type: ApplicationCommandOptionType.Boolean,
    }],
    description: "Display information about the bot.",
    handler: async (interaction) => {
        const detailed = interaction.options.getBoolean("detailed");
        const memoryUsageRaw = process.memoryUsage().heapUsed / 1048576; // 1024*1024
        const totalMemRaw = os.totalmem() / 1048576; // 1024*1024
        const totalMem = totalMemRaw >= 1024 ? `${(totalMemRaw / 1024).toFixed()}GB` : `${totalMemRaw.toFixed()}MB`;
        const memoryUsage = memoryUsageRaw >= 1024 ? `${(memoryUsageRaw / 1024).toFixed()}GB` : `${memoryUsageRaw.toFixed()}MB`;
        const gitInfo = await getGitInfo();
        
        const generalFields = [
            { name: "User", value: client.user!.toString(), inline: true },
            { name: "Guilds", value: (await client.guilds.fetch()).size.toString(), inline: true },
            { name: "Users (cached)", value: client.users.cache.size.toString(), inline: true },
            { name: "Created", value: time(client.user!.createdAt, TimestampStyles.LongDateTime), inline: false },
        ]

        if (interaction.inGuild()) generalFields.push({ name: "Joined", value: time(interaction.guild!.joinedAt, TimestampStyles.LongDateTime), inline: false });

        const softwareFields = [
            { name: "Node", value: process.version.substring(1), inline: true },
            { name: "TypeScript", value: client.package.devDependencies!["typescript"]!.substring(1), inline: true },
            { name: "Discord.JS", value: client.package.dependencies!["discord.js"]!.substring(1), inline: true },
        ]

        const detailedSoftwareFields = [
            { 
                name: "Software",
                value: Object.entries({ node: process.version, ...client.package.dependencies, ...client.package.devDependencies }).map(([name, version]) => `**${name}**: ${version.startsWith("^") ? version.substring(1) : version}`).join("\n"),
                inline: false 
            }
        ];

        const hardwareFields = [
            {
                name: "Hardware",
                value: `
                    **Platform**: ${process.platform}
                    **Architecture**: ${process.arch}
                    **CPU**: ${os.cpus()[0].model}
                    **CPU Cores**: ${os.cpus().length}
                    **CPU Speed**: ${os.cpus()[0].speed}MHz
                    **RAM Usage**: ${memoryUsage}/${totalMem}
                `,
            }
        ];

        const gitFields = [
            {
                name: "Git",
                value: `
                    **Commit**: ${gitInfo.commit.slice(0, 7)}
                    **Branch**: ${gitInfo.branch}
                `,
            }
        ]

        const embed = createGenericEmbed({
            color: "Blurple",
            title: client.user?.username,
            description: `${(await client.users.fetch(client.config.users[0])).toString()}'s Discord bot.`,
            fields: generalFields,
            footer: { text: `${client.package.version} - Created with ❤️`}
        });

        embed.setURL(client.package.repository!.toString());

        if (detailed) { 
            embed.addFields([ ...detailedSoftwareFields, ...gitFields, ...hardwareFields ]);
        } else {
            embed.addFields([ ...softwareFields ]);
        }

        await interaction.editReply({ embeds: [embed] });
    },
})