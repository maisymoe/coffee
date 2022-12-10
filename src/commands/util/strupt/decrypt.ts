import { ApplicationCommandOptionType, inlineCode } from "discord.js";
import { $fetch } from "ohmyfetch";
import { decrypt } from "strupt";
import { Subcommand } from "../../../def";
import { createStatusEmbed } from "../../../lib/embeds";

export default new Subcommand({
    name: "decrypt",
    description: "Decrypt a string",
    options: [
        {
            name: "string",
            description: "The string to decrypt",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "key",
            description: "The decryption key",
            required: true,
            type: ApplicationCommandOptionType.Attachment,
        },
        {
            name: "silent",
            description: "Whether to send the output to the channel",
            type: ApplicationCommandOptionType.Boolean,
        },
    ],
    handler: async (interaction) => {
        const silent = interaction.options.getBoolean("silent");
        await interaction.deferReply({ ephemeral: silent ?? false });
        
        const givenString = interaction.options.getString("string", true);
        const keyAttachment = interaction.options.getAttachment("key", true);
        const rawKey = await $fetch(keyAttachment.url).catch(r => interaction.editReply({ embeds: [
                createStatusEmbed({
                    type: "error",
                    description: "Failed to fetch key!",
                }),
            ]
        }));
        let key;

        try {
            key = JSON.parse(rawKey);
        } catch {
            interaction.editReply({ embeds: [
                    createStatusEmbed({
                        type: "error",
                        description: "Failed to parse key!",
                    }),
                ]
            });
            return;
        }

        let decrypted;

        try {
            decrypted = decrypt(givenString, key);
        } catch(error) {
            const typedError = error as Error;
            interaction.editReply({ embeds: [
                    createStatusEmbed({
                        type: "error",
                        description: `Failed to decrypt: ${typedError.message || typedError.toString()}`,
                    }),
                ]
            });
            return;
        }

        interaction.editReply({ content: inlineCode(decrypted) });
    }
})