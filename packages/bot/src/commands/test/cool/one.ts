import { Subcommand } from "coffeelib";

export default new Subcommand({
    name: "one",
    description: "anyone up for some subcommands?",
    handler: (interaction, api) => {
        api.interactions.editReply(interaction.application_id, interaction.token, { content: "no way?" });
    }
})