import { ApplicationCommandOptionType, inlineCode } from "discord.js";
import { run } from "cumlisp";
import { client } from "../../../";
import { Subcommand, CoffeeVM } from "../../../def";
import { createStatusEmbed } from "../../../lib/embeds";
import { getVMContext } from "../../../lib/lisp/utils";

export default new Subcommand({
    name: "get",
    description: "Get a tag.",
    options: [
        {
            name: "name",
            description: "The tag to get",
            autocomplete: true,
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],
    handler: async (interaction) => {
        if (!interaction.inGuild()) {
            await interaction.editReply({
                embeds: [
                    createStatusEmbed({
                        type: "error",
                        description: `Tags are not supported in DMs.`,
                    }),
                ],
            });
            return;
        }

        const name = interaction.options.getString("name", true);
        const existingTag = client.constants?.tags.find(t => t.name === name && t.guildId === interaction.guild!.id);

        if (!existingTag) {
            await interaction.editReply({
                embeds: [
                    createStatusEmbed({
                        type: "error",
                        description: `I couldn't find a tag with the name ${inlineCode(name)}...`,
                    }),
                ],
            });
            return;
        }

        try {
            await interaction.editReply((await run(existingTag!.response, new CoffeeVM(getVMContext(interaction)))).substring(0, 2000));
        } catch(error) {
            const typedError = error as Error;
            await interaction.editReply({
                embeds: [
                    createStatusEmbed({
                        type: "error",
                        description: `LISP error in tag ${inlineCode(existingTag!.name)}: ${inlineCode(typedError.message)}`,
                    }),
                ],
            });
        }
    }
})