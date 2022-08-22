import { run } from "cumlisp";
import { ApplicationCommandOptionType, inlineCode } from "discord.js";
import { CoffeeVM, Command } from "../../def";
import { getVMContext } from "../../lib/common";
import { createErrorEmbed } from "../../lib/embeds";

export default new Command({
    name: "say",
    options: [{
        name: "text",
        description: "What to say",
        required: true,
        type: ApplicationCommandOptionType.String,
    }],
    description: "Send a given message. Supports LISP!",
    handler: async (interaction) => {
        const text = interaction.options.getString("text", true)
        const padding = `${interaction.user.toString()} *says*:\n`

        let result;

        try {
            result = {
                content: padding + (await run(text, new CoffeeVM(getVMContext(interaction)))).substring(0, 2000 - padding.length),
            }
        } catch (error) {
            const typedError = error as Error;
            result = { 
                embeds: [
                    createErrorEmbed({
                        description: inlineCode(typedError.message),
                        footer: { text: "Is your LISP correct?" }
                    }),
                ]
            }
        }

        await interaction.editReply(result);
    },
})