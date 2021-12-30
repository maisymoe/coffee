import { Command } from "../../lib/def";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { createErrorEmbed } from "../../lib/embeds";
import { client } from "../..";

export default new Command({
    name: "eval",
    description: "Evaluates JavaScript.",
    category: "developer",
    options: [
        {
            name: "code",
            description: "The code to evaluate.",
            type: "STRING",
        },
    ],
    su: true,
    async execute(interaction: CommandInteraction): Promise<any> {
        const code = interaction.options.getString("code");
        const before = Date.now();
        let result;

        try {
            result = eval(code!);
            let took = Date.now() - before;

            const embed = new MessageEmbed()
                .setColor("#36393F")
                .addFields(
                    { name: "Time taken", inline: true, value: `${took}ms` },
                    { name: "Type", inline: true, value: typeof result },
                    { name: "Evaluated", value: `\`\`\`js\n${code}\n\`\`\`` },
                    { name: "Callback", value: `\`\`\`js\n${result}\n\`\`\`` },
                );

            return await interaction.editReply({ embeds: [embed] });
        } catch (error: Error | any) {
            return await interaction.editReply({ embeds: [await createErrorEmbed("Eval", "I couldn\'t evaluate that! Here\'s the error.", [ { name: "\u200B", value: `\`\`\`js\n${error.stack ? error.stack : error.toString()}\`\`\`` } ], "can\'t code? seems like a skill issue to me!")] });
        }
    },
});
