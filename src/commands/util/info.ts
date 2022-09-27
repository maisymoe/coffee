import { ApplicationCommandOptionType, time, TimestampStyles } from "discord.js";
import { client } from "../..";
import { Command } from "../../def";
import { createStatusEmbed } from "../../lib/embeds";
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
        
        const generalFields = [
            { name: "User", value: client.user!.toString(), inline: true },
            { name: "Guilds", value: (await client.guilds.fetch()).size.toString(), inline: true },
            { name: "Users (cached)", value: client.users.cache.size.toString(), inline: true },
            { name: "Created", value: time(client.user!.createdAt, TimestampStyles.LongDateTime), inline: false },
        ]

        if (interaction.inGuild()) generalFields.push({ name: "Joined", value: time(interaction.guild!.joinedAt, TimestampStyles.LongDateTime), inline: false });

        const softwareFields = [
            { name: "Node", value: process.version.substring(1), inline: true },
            { name: "TypeScript", value: client.constants?.package.devDependencies!["typescript"]!.substring(1)!, inline: true },
            { name: "Discord.JS", value: client.constants?.package.dependencies!["discord.js"]!.substring(1)!, inline: true },
        ]

        const detailedSoftwareFields = [
            { 
                name: "Software",
                value: Object.entries({ node: process.version, ...client.constants?.package.dependencies, ...client.constants?.package.devDependencies }).map(([name, version]) => `**${name}**: ${version.startsWith("^") ? version.substring(1) : version}`).join("\n"),
                inline: false 
            }
        ];

        const hardwareItems = [
            { name: "Platform", value: process.platform },
            { name: "Architecture", value: process.arch },
            { name: "CPU", value: os.cpus()[0].model.trim() },
            { name: "CPU Cores", value: os.cpus().length },
            { name: "CPU Speed", value: `${os.cpus()[0].speed}MHz` },
            { name: "RAM Usage", value: `${memoryUsage}/${totalMem}` },
        ];

        const hardwareFields = [{ name: "Hardware", value: hardwareItems.map(o => `**${o.name}**: ${o.value.toString()}`).join("\n"), inline: false }];

        const gitItems = [
            { name: "Commit", value: client.constants?.gitInfo.commit.slice(0, 7) },
            { name: "Branch", value: client.constants?.gitInfo.branch },
        ]

        const gitFields = [{ name: "Git", value: gitItems.map(o => `**${o.name}**: ${o.value?.toString()}`).join("\n"), inline: false }];

        const embed = createStatusEmbed({
            type: "info",
            title: client.user?.username,
            description: `${client.constants?.users[0].toString()}'s Discord bot.`,
            fields: generalFields,
            footer: { text: `${client.constants?.package.version} - Created with ❤️`}
        });

        embed.setURL(client.constants?.package.repository?.toString()!);

        if (detailed) { 
            embed.addFields([ ...detailedSoftwareFields, ...gitFields, ...hardwareFields ]);
        } else {
            embed.addFields([ ...softwareFields ]);
        }

        await interaction.editReply({ embeds: [embed] });
    },
})