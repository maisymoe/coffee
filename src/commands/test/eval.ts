import { Command } from "../../lib/def";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { client } from "../..";

export default new Command({
    name: "eval",
    description: "Evaluate code - only available to developers!",
    su: true,
    options: [
        {
            name: "code",
            description: "Code to evaluate",
            required: true,
            type: "STRING",
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

            embed = new MessageEmbed({
                description: "Success!",
                color: client.config.cosmetics.palette.success,
                fields: [
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
                        value: `\`\`\`js\n${code!}\`\`\``,
                    },
                    {
                        name: "Callback",
                        value: `\`\`\`js\n${callback}\`\`\``,
                    }
                ],
            });
        } catch (e) {
            const typedError = e as Error;
            embed = new MessageEmbed({
                description: "Error...",
                color: client.config.cosmetics.palette.error,
                fields: [
                    {
                        name: "Evaluated",
                        value: `\`\`\`js\n${code!}\`\`\``,
                    },
                    {
                        name: "Error",
                        value: `\`\`\`js\n${typedError.stack ? typedError.stack : typedError.toString()}\`\`\``,
                    }
                ],
            });
        };

        return interaction.editReply({ embeds: [embed] });
    }
});