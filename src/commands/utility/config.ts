import { Command, CommandOptions } from "../../lib/def"
import { client, CoffeeBot } from "../../"
import { CommandInteraction } from "discord.js"

export default class ConfigCommand extends Command {
    public constructor(client: CoffeeBot) {
        const opts: CommandOptions = {
            name: "config",
            description: "Sets a config option.",
            category: "utility",
            su: true,
            options: [
                {
                    name: "key",
                    description: "The setting to change.",
                    type: "STRING",
                    required: true
                },
                {
                    name: "value",
                    description: "The value to set.",
                    type: "STRING",
                    required: true
                }
            ]
        }
        super(client, opts)
    }

    async execute(interaction: CommandInteraction) {
        const key = interaction.options.getString("key")!
        const value = interaction.options.getString("value")!
        client.provider.set(interaction.guild!, key, value);
        return await interaction.editReply(`Updated ${key} to ${value}.\nResulting object: ${client.provider.get(interaction.guild!, key)}`)
    }
}
