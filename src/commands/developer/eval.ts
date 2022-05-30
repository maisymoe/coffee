import { Command } from "../../lib/def";
import { CommandInteraction } from "discord.js";

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
        const code = interaction.options.getString("code");
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
                    value: `\`\`\`js\n${code!.substring(0, 1024)}\`\`\``,
                },
                {
                    name: "Callback",
                    value: `\`\`\`js\n${callback.toString().substring(0, 1024)}\`\`\``,
                }
            ]);
        } catch (e) {
            const typedError = e as Error;

            embed = createStatusEmbed("error", "Error...", [
                {
                    name: "Evaluated",
                    value: `\`\`\`js\n${code!.substring(0, 1024)}\`\`\``,
                },
                {
                    name: "Error",
                    value: `\`\`\`js\n${(typedError.stack ? typedError.stack : typedError.toString()).substring(0, 1024)}\`\`\``,
                }
            ]);
        };

        return await reply(interaction, { embeds: [embed] });
    }
});
