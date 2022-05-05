import { client } from "..";
import { Interaction } from "discord.js";
import { commands } from "./commandHandler";
import handleError from "./handleError";
import { createStatusEmbed } from "./embeds";

export default async function () {
    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isCommand()) return;

        const command = commands.find(i => i.name === interaction.commandName);

        if (!command?.ignoreAck) {
            await interaction.deferReply({ ephemeral: command?.ephemeral || false });
        }

        if (command?.su && !client.config.users.includes(interaction.user.id)) {
            await interaction.editReply({ embeds: [createStatusEmbed("warn", `You don't have permission to use \`${interaction.commandName}\`.`)] });
            return;
        }

        try {
            await command?.callback(interaction);
        } catch(e) { 
            handleError(interaction, e as Error) 
        }
    })
};