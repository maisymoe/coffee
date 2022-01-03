import { Command, CommandOptions } from "../../lib/def";
import { client, CoffeeBot } from "../../";
import { CommandInteraction } from "discord.js";
import { submitCommands } from "../../handlers/commandHandler";

export default class ReloadCommand extends Command {
    public constructor(client: CoffeeBot) {
        const opts: CommandOptions = {
            name: "reload-json",
            description: "Reloads all JSON commands.",
            category: "utility",
            su: true,
        };
        super(client, opts);
    }

    async execute(interaction: CommandInteraction) {
        client.dynamicData.jsonCommands.reload();
        await submitCommands(client);
        return await interaction.editReply("Done!");
    }
}
