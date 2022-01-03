import { CommandInteraction, MessageOptions } from "discord.js";
import { VM, VMContext, run } from "../../formatter";
import { client, CoffeeBot } from "../../index";
import { Command, CommandOptions } from "../../lib/def";
import { TextBasedChannel } from "../../lib/discord";

interface SayResult {
    error: boolean;
    text: string;
}

export async function say(code: string, vmContext: VMContext): Promise<SayResult | null> {
    let text: string;
    try {
        text = await run(code, new VM(vmContext));
    } catch (ex) {
        return {
            error: true,
            text: `**Formatting error**: \`${ex}\` (was the code correct?)`,
        };
    }

    if (text != "")
        return {
            error: false,
            text,
        };

    return null;
}

export default class SayCommand extends Command {
    public constructor(client: CoffeeBot) {
        const opts: CommandOptions = {
            name: "say",
            description: "A say command capable of parsing LISP.",
            category: "utility",
            options: [
                {
                    name: "text",
                    description: "What to say. Allows LISP.",
                    type: "STRING",
                    required: true,
                },
            ],
        };
        super(client, opts);
    }

    async execute(interaction: CommandInteraction): Promise<any> {
        const text = interaction.options.getString("text")!;
        const sayResult = await say(text, {
            client: client,
            channel: interaction.channel as TextBasedChannel,
            cause: interaction.user,
            writer: interaction.user,
            protectedContent: false,
            args: [],
        });
        if (sayResult) {
            return await interaction.editReply(
                `*${interaction.user.toString()} says:*\n${sayResult.text}`,
            );
        }
    }
}
