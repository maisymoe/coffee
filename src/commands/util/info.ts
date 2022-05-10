import { Command } from "../../lib/def";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { client } from "../..";

import meta from "../../../package.json";
import os from "os";

export default new Command({
    name: "info",
    description: "Generic info about the bot.",
    callback: async (interaction: CommandInteraction) => {
        const memoryUsageRaw = process.memoryUsage().heapUsed / 1048576; // 1024*1024
        const totalMemRaw = os.totalmem() / 1048576; // 1024*1024
        const totalMem = totalMemRaw >= 1024 ? `${(totalMemRaw / 1024).toFixed()}GB` : `${totalMemRaw.toFixed()}MB`;
        const memoryUsage = memoryUsageRaw >= 1024 ? `${(memoryUsageRaw / 1024).toFixed()}GB` : `${memoryUsageRaw.toFixed()}MB`;

        const infoEmbed = new MessageEmbed({
            title: client.user?.username,
            color: client.config.cosmetics.palette.accent,
            thumbnail: {
                url: client.user?.avatarURL()!,
            },
            description: meta.description.replace("Beef", (await client.users.fetch(client.config.users[0]))?.tag),
            fields: [
                {
                    name: "General",
                    value: `
                        **User**: ${client.user?.tag} (${client.user?.id})
                        **Servers**: ${(await client.guilds.fetch()).size}
                        **Users (cached)**: ${client.guilds.cache.reduce((a: any, b: {memberCount: any}) => a + b.memberCount, 0)}
                        **Created**: ${client.user?.createdAt.toDateString()}
                        ${interaction.inGuild() ? `**Joined:** ${interaction.guild?.me?.joinedAt?.toDateString()}` : ""}
                    `
                },
                {
                    name: "Software",
                    value: `
                        **Coffee:** ${meta.version}
                        **Node.JS**: ${process.version}
                        **TypeScript**: v${meta.devDependencies["typescript"].slice(1)}
                        **Discord.JS**: v${meta.dependencies["discord.js"].slice(1)}
                    `
                },
                {
                    name: "Hardware",
                    value: `
                        **Platform**: ${process.platform}
                        **Architecture**: ${process.arch}
                        **CPU**: ${os.cpus()[0].model}
                        **CPU Cores**: ${os.cpus().length}
                        **CPU Speed**: ${os.cpus()[0].speed}MHz
                        **RAM Usage**: ${memoryUsage}/${totalMem}
                    `
                }
            ]
        });

        return interaction.editReply({ embeds: [infoEmbed] });
    }
});