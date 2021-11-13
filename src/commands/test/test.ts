import { Command } from "../../lib/def";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { client } from "../../index";

export default new Command({
    name: "test",
    description: "test",
    category: "test",
    // options: [
    //     {
    //         name: "autocomplete",
    //         description: "i have no idea what i am doing",
    //         type: "STRING",
    //         choices: [
    //             {
    //                 name: "Choice 1",
    //                 value: "choice1",
    //             },
    //             {
    //                 name: "Choice 2",
    //                 value: "choice2",
    //             },
    //         ]
    //     },
    // ],
    async execute(interaction: CommandInteraction): Promise<any> {
        throw new Error("Please show me traces");
        // return await interaction.editReply({
        //     content: `I am ${client.user?.username}, and you chose ${interaction.options.getString("autocomplete")}`,
        // });
    },
});
