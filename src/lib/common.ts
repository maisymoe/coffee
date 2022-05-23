import { CommandInteraction, InteractionReplyOptions, ModalSubmitInteraction } from "discord.js";

export async function reply(interaction: CommandInteraction | ModalSubmitInteraction, options: InteractionReplyOptions) {
    if (interaction.replied || interaction.deferred) {
        await interaction.editReply(options);
    } else if (interaction.isRepliable()) {
        await interaction.reply(options);
    }
}