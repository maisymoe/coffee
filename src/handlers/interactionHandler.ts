import { Interaction } from "discord.js";

import { client } from "../index";
import { Button, SelectMenu, Command } from "../lib/def";
import { commands } from "./commandHandler";
import { buttons, selects } from "./componentHandler";

export default async function init() {
    const before = Date.now();
    if (!client.application?.owner) client.application?.fetch();

    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isCommand() && !interaction.isContextMenu()) return;
        if (!commands.has(interaction.commandName)) return;

        const command: Command | undefined = commands.get(
            interaction.commandName
        );

        if (command!.ephemeral) {
            await interaction.deferReply({ ephemeral: true });
        } else {
            await interaction.deferReply();
        }

        try {
            await command!.execute(interaction);
        } catch (error) {
            console.log("CommandInteraction handler exception:", error);

            await interaction.editReply({
                content: `CommandInteraction handler exception: \n\`\`\`${error}\`\`\``,
            });
        }
    });

    client.on("interactionCreate", async (interaction: Interaction) => {
        if (!interaction.isButton()) return;
        if (!buttons.has(interaction.customId)) return;

        const button: Button | undefined = buttons.get(interaction.customId);

        if (button!.ephemeral) {
            await interaction.deferReply({ ephemeral: true });
        } else {
            await interaction.deferReply();
        }

        try {
            await button?.execute(interaction);
        } catch (error) {
            console.log("ButtonInteraction handler exception:", error);

            await interaction.editReply({
                content: `ButtonInteraction handler exception: \n\`\`\`${error}\`\`\``,
            });
        }
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isSelectMenu()) return;
        if (!selects.has(interaction.customId)) return;

        const select: SelectMenu | undefined = selects.get(
            interaction.customId
        );

        if (select!.ephemeral) {
            await interaction.deferReply({ ephemeral: true });
        } else {
            await interaction.deferReply();
        }

        try {
            await select?.execute(interaction);
        } catch (error) {
            console.log("SelectMenuInteraction handler exception:", error);

            await interaction.editReply({
                content: `SelectMenuInteraction handler exception: \n\`\`\`${error}\`\`\``,
            });
        }
    });

    console.log(
        `Interaction handler initialised. Took ${Date.now() - before}ms.`
    );
}
