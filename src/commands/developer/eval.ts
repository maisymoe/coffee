import { Command } from "../../lib/def";
import { CommandInteraction, Formatters } from "discord.js";

import { createStatusEmbed } from "../../lib/embeds";
import { reply } from "../../lib/common";

export default new Command({
    name: "eval",
    description: "Evaluate code - only available to developers!",
    su: true,
    options: [
        {
            name: "code",
            description: "The code to evaluate.",
            type: "STRING",
            required: true,
        }
    ],
    callback: async (interaction: CommandInteraction) => {
        const code = interaction.options.getString("code", true);
        const before = Date.now();

        let took;
        let callback;
        let embed;

        try {
            callback = eval(code!);
            took = Date.now() - before;

            embed = createStatusEmbed("success", "Success!", [
                {
                    name: "Time",
                    value: `${took}ms`,
                    inline: true,
                },
                {
                    name: "Type",
                    value: typeof callback,
                    inline: true,
                },
                {
                    name: "Evaluated",
                    value: Formatters.codeBlock("js", code.substring(0, 1000)),
                },
                {
                    name: "Callback",
                    value: Formatters.codeBlock("js", callback.toString().substring(0, 1000)),
                }
            ]);
        } catch (e) {
            const typedError = e as Error;

            embed = createStatusEmbed("error", "Error...", [
                {
                    name: "Evaluated",
                    value: Formatters.codeBlock("js", code.substring(0, 1000)),
                },
                {
                    name: "Error",
                    value: Formatters.codeBlock("js", (typedError.stack ? typedError.stack : typedError.toString()).substring(0, 1000)),
                }
            ]);
        };

        return await reply(interaction, { embeds: [embed] });
    }
});
