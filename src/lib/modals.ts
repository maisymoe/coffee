import { Modal, CommandInteraction, ModalSubmitInteraction } from "discord.js";
import { createStatusEmbed } from "./embeds";

export async function showModal(modal: Modal, time: number, interaction: CommandInteraction): Promise<ModalSubmitInteraction | undefined> {
    const customId = modal.customId + interaction.id;
    modal.setCustomId(customId);

    await interaction.showModal(modal);
    try {
        const submit = await interaction.awaitModalSubmit({
            filter: (i) => i.customId === customId,
            time: time,
        });
        return submit;
    } catch (e) {
        interaction.followUp({ embeds: [createStatusEmbed("warn", "Whoops, your modal timed out.")], ephemeral: true });
    }
}