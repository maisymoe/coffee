import { Command } from "../../lib/def";
import { CommandInteraction } from "discord.js";

export default new Command({
    name: "test",
    description: "test",
    category: "test",
    async execute(interaction: CommandInteraction): Promise<any> {
        return await interaction.editReply({ content: "Test command. heck." });
    },
});
