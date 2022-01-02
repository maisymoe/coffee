import { Command } from "../../lib/def";
import { client } from "../../";
import { CommandInteraction } from "discord.js";
import { submitCommands } from "../../handlers/commandHandler";

export default new Command({
    name: "reload-json",
    description: "Reloads all JSON commands.",
    category: "utility",
    su: true,
    async execute(interaction: CommandInteraction) {
        client.dynamicData.jsonCommands.reload();
        await submitCommands(client);
        return await interaction.editReply("Done!");
    },
});
