import { ApplicationCommandOptionType, codeBlock } from "discord.js";
import { client } from "../..";
import { Command } from "../../def";
import { createGenericEmbed, createErrorEmbed } from "../../lib/embeds";

const AsyncFunction = (async function () {}).constructor;

export default new Command({
    name: "eval",
    description: "Run JS in the bot context - for developers!",
    su: true,
    options: [{
        name: "code",
        description: "The code to run (runs as a function!)",
        required: true,
        type: ApplicationCommandOptionType.String,
    }],
    handler: async (interaction) => {
        const code = interaction.options.getString("code", true);
        const before = Date.now();

        let took;
        let result;
        let embed;

        try {
            result = await (AsyncFunction("client", "interaction", code))(client, interaction);
            took = Date.now() - before;

            embed = createGenericEmbed({ description: "Success!", color: "Green", fields: [
                    { name: "Time", value: `${took}ms`, inline: true },
                    { name: "Type", value: typeof result, inline: true },
                    { name: "Evaluated", value: codeBlock("js", code.substring(0, 1000)), inline: false },
                ]
            });

            if (result !== undefined) {
                embed.addFields([{ name: "Result", value: codeBlock("js", JSON.stringify(result).substring(0, 1000)), inline: false }]);
            }
        } catch (error) {
            const typedError = error as Error;

            embed = createErrorEmbed({ description: "Error...", fields: [
                    { name: "Evaluated", value: codeBlock("js", code.substring(0, 1000)), inline: false },
                    { name: "Error", value: codeBlock("js", (typedError.stack || typedError.message || typedError.toString()).substring(0, 1000)), inline: false },
                ]
            });
                
        }

        await interaction.editReply({ embeds: [embed] });
    },
})