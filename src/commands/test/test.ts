import { Command } from "../../def";

export default new Command({
    name: "test",
    description: "Test command",
    handler: async (interaction) => {
        await interaction.editReply({ content: "Test command" });
    },
})