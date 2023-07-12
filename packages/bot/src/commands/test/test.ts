import { Command } from "coffeelib";

export default new Command({
    name: "test",
    description: "this is a nice test command",
    handler: (interaction, api) => {
        api.interactions.editReply(interaction.application_id, interaction.token, { content: "violence." });
        api.interactions.editReply(interaction.application_id, interaction.token, { content: "violence 2: electric boogaloo" });
    }
})