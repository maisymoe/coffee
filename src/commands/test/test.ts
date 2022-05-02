import { Command } from "../../lib/def";
import { CommandInteraction } from "discord.js";

export default new Command({
    name: "test",
    description: "A test command",
    callback: async (interaction: CommandInteraction) => {
        throw new Error("This is a test error");
        return interaction.editReply("This is a test command.");
    }
});