import { Command } from "../../lib/def";
import { CommandInteraction, Modal, ModalSubmitInteraction } from "discord.js";
import { createStatusEmbed } from "../../lib/embeds";

import { showModal } from "../../lib/modals";
import { reply } from "../../lib/common";

export default new Command({
    name: "eval",
    description: "Evaluate code - only available to developers!",
    su: true,
    devOnly: true,
    ignoreAck: true,
    options: [
        {
            name: "text",
            description: "Evaluate text from a command",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "code",
                    description: "The code to evaluate",
                    type: "STRING",
                    required: true,
                }
            ]
        },
        {
            name: "modal",
            description: "Evaluate text from a modal",
            type: "SUB_COMMAND",
        }
    ],
    callback: async (interaction: CommandInteraction) => {
        let code: string;
        let modalReply: ModalSubmitInteraction | undefined;

        if (interaction.options.getSubcommand() === "text") {
            code = interaction.options.data[0].options![0].value!.toString();
        } else {
            modalReply = await showModal(new Modal({
                customId: "eval",
                title: "Eval",
                components: [
                    {
                        type: "ACTION_ROW",
                        components: [
                            {
                                type: "TEXT_INPUT",
                                style: "PARAGRAPH",
                                minLength: 1,
                                customId: "codeInput",
                                label: "Code",
                                required: true,
                            }
                        ]
                    }
                ]
            }), 600000, interaction);
            code = modalReply?.fields.getTextInputValue("codeInput")!;
        }

        const before = Date.now();
        let took;
        let callback;
        let embed;

        try {
            callback = eval(code!);
            took = Date.now() - before;

            embed = createStatusEmbed("success", "Success!", [
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
            ]);
        } catch (e) {
            const typedError = e as Error;

            embed = createStatusEmbed("error", "Error...", [
                {
                    name: "Evaluated",
                    value: `\`\`\`js\n${code!}\`\`\``,
                },
                {
                    name: "Error",
                    value: `\`\`\`js\n${typedError.stack ? typedError.stack : typedError.toString()}\`\`\``,
                }
            ]);
        };

        return await reply(modalReply ? modalReply : interaction, { embeds: [embed] });
    }
});