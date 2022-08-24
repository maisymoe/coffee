import { ApplicationCommandOptionType } from "discord.js";
import { client } from "../..";
import { Command } from "../../def";
import { createGenericEmbed, createErrorEmbed } from "../../lib/embeds";

export default new Command({
    name: "blacklist",
    description: "Modify the blacklist - for developers!",
    su: true,
    options: [
        {
            name: "add",
            description: "Add a user to the blacklist",
            options: [{
                name: "user",
                description: "The user to add",
                required: true,
                type: ApplicationCommandOptionType.User,
            }],
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "remove",
            description: "Remove a user from the blacklist",
            options: [{
                name: "user",
                description: "The user to remove",
                required: true,
                type: ApplicationCommandOptionType.User,
            }],
            type: ApplicationCommandOptionType.Subcommand,
        },
    ],
    handler: async (interaction) => {
        const type = interaction.options.getSubcommand(true);
        const user = interaction.options.getUser("user", true);
        let embed;

        if (type === "add") {
            if (client.config.blacklist.includes(user.id)) { 
                embed = createErrorEmbed({ description: `${user.toString()} is already in the blacklist!`});
            } else {
                client.config.blacklist.push(user.id);
                embed = createGenericEmbed({ color: "Green", description: `${user.toString()} was added to the blacklist.`, footer: { text: "L" } });
            };
        } else {
            if (!client.config.blacklist.includes(user.id)) { 
                embed = createErrorEmbed({ description: `${user.toString()} is not in the blacklist!`});
            } else {
                client.config.blacklist.splice(client.config.blacklist.indexOf(user.id));
                embed = createGenericEmbed({ color: "Green", description: `${user.toString()} was removed from the blacklist.` });
            };
        }

        interaction.editReply({ embeds: [embed] });
    },
})