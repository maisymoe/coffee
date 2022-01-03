import { Command, CommandOptions } from "../../lib/def";
import { CommandInteraction } from "discord.js";
import { CoffeeBot } from "../..";

export default class TestCommand extends Command {
    public constructor(client: CoffeeBot) {
        const opts: CommandOptions = {
            name: "test",
            description: "test",
            category: "test",
        };
        super(client, opts);
    }

    async execute(interaction: CommandInteraction): Promise<any> {
        return await interaction.editReply({ content: "Test command. heck." });
    }
}
