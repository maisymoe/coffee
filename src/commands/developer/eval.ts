import { ApplicationCommandOptionType, codeBlock, cleanCodeBlockContent } from "discord.js";
import { client } from "../..";
import { Command } from "../../def";
import { createStatusEmbed } from "../../lib/embeds";

const AsyncFunction = (async function () {}).constructor;

export default new Command({
    name: "eval",
    description: "Run JS in the bot context - for developers!",
    su: true,
    noAck: true,
    options: [
        {
            name: "code",
            description: "The code to run (runs as a function!)",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "silent",
            description: "Whether to the output to the channel",
            type: ApplicationCommandOptionType.Boolean,
        }
    ],
    handler: async (interaction) => {
        const silent = interaction.options.getBoolean("silent");
        await interaction.deferReply({ ephemeral: silent ?? false });

        const code = interaction.options.getString("code", true);
        const before = Date.now();

        let took;
        let result;
        let embed;

        try {
            result = await (AsyncFunction("client", "interaction", "require", code))(client, interaction, require);
            took = Date.now() - before;

            embed = createStatusEmbed({
                type: "success", 
                fields: [
                    { name: "Time", value: `${took}ms`, inline: true },
                    { name: "Type", value: typeof result, inline: true },
                    { name: "Evaluated", value: codeBlock("js", cleanCodeBlockContent(code.substring(0, 1000))), inline: false },
                ]
            });

            if (result !== undefined) embed.addFields([{ name: "Result", value: codeBlock("js", cleanCodeBlockContent(JSON.stringify(result, null, 4).substring(0, 1000))), inline: false }]);
        } catch (error) {
            const typedError = error as Error;

            embed = createStatusEmbed({
                type: "error",
                fields: [
                    { name: "Evaluated", value: codeBlock("js", code.substring(0, 1000)), inline: false },
                    { name: "Error", value: codeBlock("js", cleanCodeBlockContent((typedError.stack || typedError.message || typedError.toString()).substring(0, 1000))), inline: false },
                ]
            });
        }

        if (JSON.stringify(result, null, 4)?.includes(client.config.token) && !silent) {
            await interaction.editReply({
                embeds: [
                    createStatusEmbed({
                        type: "warn",
                        description: "The result was hidden because it contained the bot token."
                    }),
                ],
            });
            await interaction.followUp({ embeds: [embed], ephemeral: true });
        } else {
            await interaction.editReply({ embeds: [embed] });
        }
    },
})