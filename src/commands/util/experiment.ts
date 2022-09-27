import { ApplicationCommandOptionType, inlineCode } from "discord.js";
import { v3 } from "murmurhash";
import { Command } from "../../def";
import { createStatusEmbed } from "../../lib/embeds";

export default new Command({
    name: "experiment",
    description: "Decodes a the murmurhash3 of an experiment, finding a user's rollout.",
    options: [
        {
            name: "experiment",
            description: "The experiment name",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "user",
            description: "The user",
            type: ApplicationCommandOptionType.User,
            required: true,
        }
    ],
    handler: async (interaction) => {
        const experiment = interaction.options.getString("experiment", true);
        const user = interaction.options.getUser("user", true);

        const key = `${experiment}:${user.id}`;
        const hash = v3(key);

        const embed = createStatusEmbed({
            type: "success",
            fields: [
                { name: "Experiment", value: inlineCode(experiment), inline: false },
                { name: "User", value: user.toString(), inline: true },
                { name: "Hash", value: hash.toString(), inline: true },
                { name: "Rollout", value: (hash % 10000).toString(), inline: true },
            ]
        })

        interaction.editReply({ embeds: [embed] });
    },
})