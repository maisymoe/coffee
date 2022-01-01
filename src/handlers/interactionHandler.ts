import { client } from "..";
import { Interaction } from "discord.js";
import { Command } from "../lib/def";
import { createErrorEmbed } from "../lib/embeds";
import { reportError } from "../lib/common";

import { commands } from "./commandHandler";

export default async () => {
    const before = Date.now();

    client.on("interactionCreate", async(interaction: Interaction) => {
        if (!interaction.isCommand()) return;
        const command: Command | undefined = commands.find(i => i.name === interaction.commandName);

        if (command!.ephemeral) {
            await interaction.deferReply({ ephemeral: true });
        } else {
            await interaction.deferReply();
        }

        if (command!.su && !client.dynamicData.config.data.users!.includes(interaction.user.id)) {
            await interaction.editReply({ embeds: [await createErrorEmbed("Missing permissions", `${interaction.user.username} is not in the sudoers file. This incident will be reported.` )] });
            return;
        }

        try {
            await command!.execute(interaction);
        } catch (error: Error | any) {
            const errorMessage = `An error occurred when handling an interaction created by ${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id}), calling command ${interaction.commandName}:`
            await reportError(errorMessage, error);

            await interaction.editReply({
                embeds: [await createErrorEmbed("Interaction handler threw an exception...", "This error has been automatically reported.")],
            });
        }
    })

    console.log(`Interaction handler initialised. Took ${Date.now() - before}ms.`);
}