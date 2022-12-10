import { ApplicationCommandOptionType } from "discord.js";
import { client } from "../../..";
import { Subcommand } from "../../../def";
import { createStatusEmbed } from "../../../lib/embeds";

export default new Subcommand({
    name: "remove",
    description: "Remove a user from the blacklist",
    options: [{
        name: "user",
        description: "The user to remove",
        required: true,
        type: ApplicationCommandOptionType.User,
    }],
    handler: async (interaction) => {
        const user = interaction.options.getUser("user", true);
        let embed;

        if (!client.config.blacklist.includes(user.id)) { 
            embed = createStatusEmbed({
                type: "error",
                description: `${user.toString()} is not in the blacklist!`
            });
        } else {
            client.config.blacklist.splice(client.config.blacklist.indexOf(user.id));
            embed = createStatusEmbed({
                type: "success",
                description: `${user.toString()} was removed from the blacklist.`
            });
        };

        interaction.editReply({ embeds: [embed] });
    }
})