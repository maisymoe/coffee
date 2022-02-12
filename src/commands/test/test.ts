import { Command, CommandOptions } from "../../lib/def";
import { CommandInteraction, Interaction, Modal } from "discord.js";
import { CoffeeBot } from "../..";

export default class TestCommand extends Command {
    public constructor(client: CoffeeBot) {
        const opts: CommandOptions = {
            name: "test",
            description: "test",
            category: "test",
            ignoreAck: true,
        };
        super(client, opts);
    }

    async execute(interaction: CommandInteraction): Promise<any> {
        const testModal = new Modal({
            customId: "test",
            title: "Test",
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "TEXT_INPUT",
                            style: "SHORT",
                            placeholder: "Examples: \"en-GB\" or \"fr\"",
                            customId: "textInput",
                            label: "Please input your Discord locale.",
                        }
                    ]
                }
            ]
        })

        return await interaction.presentModal(testModal).then(() => {
            this.client.once("interactionCreate", (interaction: Interaction) => {
                if (!interaction.isModalSubmit()) return;

                const givenLocale = interaction.fields.getTextInputValue("textInput");

                if (givenLocale.toLowerCase() === interaction.locale.toLowerCase()) {
                    interaction.reply(`You are correct! Your client locale is: ${interaction.locale}`);
                } else {
                    interaction.reply(`You are lying! Your client locale is: ${interaction.locale}, and you entered ${givenLocale}`);
                }
            })
        });
    }
}
