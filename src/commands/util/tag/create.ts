import { ApplicationCommandOptionType, inlineCode } from "discord.js";
import { client } from "../../../";
import { Subcommand } from "../../../def";
import { createStatusEmbed } from "../../../lib/embeds";

export default new Subcommand({
    name: "create",
    description: "Create a tag.",
    options: [
        {
            name: "name",
            description: "The name of the tag",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "response",
            description: "The response the tag should send. Supports LISP!",
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

        if (!(await interaction.guild!.members.fetch(interaction.user.id)).permissions.has("ManageMessages")) {
            await interaction.editReply({
                embeds: [
                    createStatusEmbed({
                        type: "error",
                        description: `You need a role with the Manage Messages permission to create or modify tags.`,
                    }),
                ],
            });
            return;
        }

        const name = interaction.options.getString("name", true);
        const response = interaction.options.getString("response");
        const existingTag = client.constants?.tags.find(t => t.name === name && t.guildId === interaction.guild!.id);

        if (existingTag) { 
            await interaction.editReply({
                embeds: [
                    createStatusEmbed({
                        type: "error",
                        description: `A tag with the name ${inlineCode(name)} already exists in this server...`,
                    })
                ]
            });
            return;
        }

        client.constants?.tags.push({ name: name, response: response!, guildId: interaction.guild!.id });
        await interaction.editReply({
            embeds: [
                createStatusEmbed({
                    type: "success",
                    description: `Successfully created tag ${inlineCode(name)}.`,
                })
            ]
        });
    }
})