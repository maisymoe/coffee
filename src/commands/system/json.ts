import { Command, CommandOptions, JSONCommand as JSONCmd } from "../../lib/def";
import { CoffeeBot } from "../..";
import { CommandInteraction } from "discord.js";
import { VM, VMContext } from "../../formatter";
import { TextBasedChannel } from "../../lib/discord";
import { run } from "cumlisp";

export default class JSONCommand extends Command {
    private readonly command: JSONCmd;

    public constructor(client: CoffeeBot, category: string, name: string, json: JSONCmd) {
        const opts: CommandOptions = {
            name: `${name.toLowerCase()}`,
            description: json.description || "No Description.",
            category: category.toLowerCase(),
        };

        super(client, opts);
        this.command = json;
    }

    public async execute(interaction: CommandInteraction): Promise<any> {
        const vmContext: VMContext = {
            client: this.client,
            channel: interaction.channel as TextBasedChannel,
            writer: interaction.user,
            cause: interaction.user,
            protectedContent: false,
            args: [],
        };

        let formatText;
        {
            const vm = new VM(vmContext);
            formatText = await run(this.command.format || "", vm);
        }

        if (formatText != "") return await interaction.editReply(formatText);
    }
}
