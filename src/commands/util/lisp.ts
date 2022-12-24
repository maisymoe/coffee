import { ApplicationCommandOptionType, inlineCode } from "discord.js";
import { run } from "cumlisp";
import { CoffeeVM, Command } from "../../def";
import { getVMContext } from "../../lib/lisp/utils";
import { createStatusEmbed } from "../../lib/embeds";

export default new Command({
    name: "lisp",
    options: [{
        name: "expression",
        description: "The expression to evaluate",
        required: true,
        type: ApplicationCommandOptionType.String,
    }],
    description: "Evaluate LISP expressions.",
    handler: async (interaction) => {
        const expression = interaction.options.getString("expression", true);

        let embed;

        try {
            embed = createStatusEmbed({
                type: "success",
                description: (await run(expression, new CoffeeVM(getVMContext(interaction)))).substring(0, 1000),
            });
        } catch (error) {
            const typedError = error as Error;
            embed = createStatusEmbed({
                type: "error",
                description: `${inlineCode(typedError.message)}\nNeed help? Visit our [LISP guide](https://github.com/Beefers/coffee/blob/hyper/LISP.md)!`,
            });
        }

        await interaction.editReply({ embeds: [embed] });
    },
})