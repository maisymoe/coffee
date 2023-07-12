import { DJS, Discord } from "../../deps.ts";
import { CoffeeClient } from "../client.ts";
import { Events } from "../gateway.ts";
import { commands } from "./command.ts";

export const reply = async (interaction: Discord.APIChatInputApplicationCommandInteraction, api: typeof DJS.API.prototype, content: Omit<Discord.RESTPostAPIWebhookWithTokenJSONBody, "username" | "avatar_url">) =>
    await api.interactions.getOriginalReply(interaction.application_id, interaction.token) ?
    await api.interactions.editReply(interaction.application_id, interaction.token, content) :
    await api.interactions.reply(interaction.id, interaction.token, content);


export async function setupInteractionHandler(client: CoffeeClient) {
    client.on(Events.InteractionCreate, async ({ data: interaction, api }) => {
        if (interaction.type !== Discord.InteractionType.ApplicationCommand) return;
        const commandInteraction = interaction as Discord.APIChatInputApplicationCommandInteraction;

        const command = commands.find(i => i.name === interaction.data.name);
        if (!command) return;

        try {
            await api.interactions.defer(commandInteraction.id, commandInteraction.token);

            if (command.handler instanceof Function) {
                await command.handler(commandInteraction, api);
            } else {
                const subcommandName = commandInteraction.data.options?.find(i => i.type = DJS.ApplicationCommandOptionType.Subcommand)?.name;
                const subcommand = command.handler.find(i => i.name === subcommandName);
                await subcommand?.handler(commandInteraction, api);
            }
        } catch(e) {
            reply(commandInteraction, api, { content: `error...\n${DJS.formatters.codeBlock("js", e.stack ?? e.toString())}` })
        }
    });
}