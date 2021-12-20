import { Command } from "../../lib/def";
import { CommandInteraction, Message, MessageEmbed } from "discord.js";
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
        // client.on("messageCreate", (message) => {
        //     if (!message.content.startsWith("VCTEST:")) return;
            
        //     message.reply(`You said ${message.content}`);
        // })

        // const channel = await client.channels.fetch("878677833935892510");
        // if (!channel?.isText()) return console.log("Channel is not a text channel");

        // try {
        //     channel?.send("test");
        // } catch(error) {
        //     console.log(error);
        // }

        // function sleep(ms: number) {
        //     return new Promise(resolve => setTimeout(resolve, ms));
        // }

        // await interaction.editReply({ content: "I will be leaving in 5 seconder" })
        // sleep(5000);
        // await interaction.guild?.leave();
        return await interaction.editReply({ content: "heck." });
    },
});
