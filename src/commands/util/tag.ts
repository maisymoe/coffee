import { ApplicationCommandOptionType, inlineCode } from "discord.js";
import { run } from "cumlisp";
import { client } from "../..";
import { Command, CoffeeVM } from "../../def";
import { createStatusEmbed } from "../../lib/embeds";
import { getVMContext } from "../../lib/lisp/utils";

export default new Command({
    name: "tag",
    options: [
        {
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
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
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
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "modify",
            description: "Modify a tag. Delete by not passing the response argument.",
            options: [
                {
                    name: "name",
                    description: "The tag to modify",
                    autocomplete: true,
                    required: true,
                    type: ApplicationCommandOptionType.String,
                },
                {
                    name: "response",
                    description: "The response the tag should send. Supports LISP!",
                    type: ApplicationCommandOptionType.String,
                },
            ],
            type: ApplicationCommandOptionType.Subcommand,
        }
    ],
    description: "Send and modify a tag.",
    handler: async (interaction) => {
        if (!interaction.inGuild()) {
            await interaction.editReply("Tags are not supported in DMs.")
            return;
        }

        const command = interaction.options.getSubcommand();
        const name = interaction.options.getString("name", true);
        const response = interaction.options.getString("response");

        const existingTag = client.constants?.tags.find(t => t.name === name && t.guildId === interaction.guild!.id);

        if (command !== "get" && !(await interaction.guild!.members.fetch(interaction.user.id)).permissions.has("ManageMessages")) {
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

        if (command !== "create" && !existingTag) {
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

        switch(command) {
            case "get":
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
            break;
            case "create":
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
            break;
            case "modify":
                client.constants?.tags.splice(client.constants.tags.indexOf(existingTag!), 1);
                if (response) client.constants?.tags.push({ name: name, response: response, guildId: interaction.guild!.id });
                await interaction.editReply({
                    embeds: [
                        createStatusEmbed({
                            type: "success",
                            description: `Successfully ${response ? "modified" : "deleted"} tag ${inlineCode(existingTag!.name)}.`,
                        })
                    ]
                });
            break;
        }
    },
})