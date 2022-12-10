import { ApplicationCommandOptionType } from "discord.js";
import { client } from "../../..";
import { Subcommand } from "../../../def";
import { createStatusEmbed } from "../../../lib/embeds";

export default new Subcommand({
    name: "add",
    description: "Add a user to the blacklist",
    options: [{
        name: "user",
        description: "The user to add",
        required: true,
        type: ApplicationCommandOptionType.User,
    }],
    handler: async (interaction) => {
        const user = interaction.options.getUser("user", true);
        let embed;

        if (client.config.blacklist.includes(user.id)) { 
            embed = createStatusEmbed({
                type: "error",
                description: `${user.toString()} is already in the blacklist!`
            });
        } else {
            client.config.blacklist.push(user.id);
            embed = createStatusEmbed({
                type: "success",
                description: `${user.toString()} was added to the blacklist.`,
                footer: { text: "L" },
            });
        };

        interaction.editReply({ embeds: [embed] });
    }
})