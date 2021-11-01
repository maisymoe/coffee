import { Command } from "../../lib/def";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { client } from "../../index";

export default new Command({
    name: "info",
    description: "Fetches info on the bot.",
    category: "bot",
    async execute(interaction: CommandInteraction): Promise<any> {
        return await interaction.editReply({
            content: `I am ${client.user?.username}`,
        });
    },
});
