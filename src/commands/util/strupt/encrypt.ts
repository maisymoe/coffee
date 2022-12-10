import { ApplicationCommandOptionType, AttachmentBuilder, inlineCode, InteractionReplyOptions } from "discord.js";
import { encrypt } from "strupt";
import { Subcommand } from "../../../def";
import { createStatusEmbed } from "../../../lib/embeds";

export default new Subcommand({
    name: "encrypt",
    description: "Encrypt a string",
    options: [
        {
            name: "string",
            description: "The string to encrypt",
            required: true,
            maxLength: 1024,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "words",
            description: "Whether to use words",
            required: true,
            type: ApplicationCommandOptionType.Boolean,
        },
        {
            name: "emojis",
            description: "Whether to use emojis",
            required: true,
            type: ApplicationCommandOptionType.Boolean,
        },
    ],
    handler: async (interaction) => {
        const givenString = interaction.options.getString("string", true);

        const words = interaction.options.getBoolean("words", true);
        const emojis = interaction.options.getBoolean("emojis", true);
        let encrypted;

        try {
            encrypted = encrypt(givenString, { words, emojis });
        } catch(error) {
            const typedError = error as Error;
            interaction.editReply({ embeds: [
                    createStatusEmbed({
                        type: "error",
                        description: `Failed to encrypt: ${typedError.message || typedError.toString()}`,
                    }),
                ]
            });
            return;
        }

        let message: InteractionReplyOptions = { files: [new AttachmentBuilder(Buffer.from(JSON.stringify(encrypted.key), "utf-8"), { name: `key-${Date.now()}.txt` })] };

        if (encrypted.string.length > 1024) { 
            message.content = "Your encrypted string was over 1024 characters, so I've uploaded it as a file!",
            message.files?.push(new AttachmentBuilder(Buffer.from(encrypted.string, "utf-8"), { name: `string-${Date.now()}.txt` }));
        } else {
            message.content = inlineCode(encrypted.string);
        };

        interaction.editReply(message);
    }
})