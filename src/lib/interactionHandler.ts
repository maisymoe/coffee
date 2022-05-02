import { client } from "..";
import { Interaction } from "discord.js";
import { commands } from "./commandHandler";

export default async function () {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const command = commands.find(i => i.name === interaction.commandName);

        await interaction.deferReply({ ephemeral: command?.ephemeral || false });

        try {
            await command?.callback(interaction);
        } catch (error) {
            console.error(`Error when ${interaction.user.tag} ran command ${interaction.commandName}:`, error);
            interaction.editReply(`An error occurred when running that command: \`\`\`js\n${error}\`\`\``);
        }
    })
};