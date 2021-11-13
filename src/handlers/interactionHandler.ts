import { client } from "..";
import { Interaction } from "discord.js";
import { Command } from "../lib/def";
import { createErrorEmbed } from "../lib/embeds";
import { reportError } from "../lib/common";

import { commands } from "./commandHandler";

export default async function init() {
    client.on("interactionCreate", async(interaction: Interaction) => {
        if (!interaction.isCommand()) return;
        const command: Command | undefined = commands.find(i => i.name === interaction.commandName);

        if (command!.ephemeral) {
            await interaction.deferReply({ ephemeral: true });
        } else {
            await interaction.deferReply();
        }

        try {
            await command!.execute(interaction);
        } catch (error: Error | any) {
            const errorMessage = `An error occurred when handling an interaction created by ${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id}), calling command ${interaction.commandName}:`
            reportError(errorMessage, error);

            await interaction.editReply({
                embeds: [await createErrorEmbed("Interaction handler threw an exception...", "This error has been automatically reported.")],
            });
        }
    })
}