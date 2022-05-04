import { client } from "..";
import { Interaction } from "discord.js";
import { commands } from "./commandHandler";
import handleError from "./handleError";

export default async function () {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const command = commands.find(i => i.name === interaction.commandName);

        if (!command?.ignoreAck) {
            await interaction.deferReply({ ephemeral: command?.ephemeral || false });
        }

        if (command?.su && !client.config.users.includes(interaction.user.id)) {
            await interaction.editReply({ content: "You do not have permission to use this command." });
            return;
        }

        try {
            await command?.callback(interaction);
        } catch(e) { 
            handleError(interaction, e as Error) 
        }
    })
};