import { Command } from "../../lib/def";
import { CommandInteraction } from "discord.js";

export default new Command({
    name: "test",
    description: "A test command",
    devOnly: true,
    options: [
        {
            name: "help",
            description: "a test",
            type: "STRING",
        }
    ],
    callback: async (interaction: CommandInteraction) => {
        return interaction.editReply({ content: `This is a test command. You said ${interaction.options.getString("help")}` });
    }
});