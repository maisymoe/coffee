import { join } from "path";
import { readdirSync } from "fs";
import { CommandInteraction } from "discord.js";

import { CoffeeBot } from "..";
import { Command } from "../lib/def";

export default async (client: CoffeeBot) => {
    const before = Date.now();
    const commandFolder = join(__dirname, "../", "commands/");
    const commandFolders = readdirSync(commandFolder);

    for (const folder of commandFolders) {
        if (folder.endsWith(".json")) continue;
        const commandFiles = readdirSync(join(commandFolder, folder)).filter(i => i.endsWith(".js"));
        for (const file of commandFiles) {
            const command = (await import(join(commandFolder, folder, file)))
                .default as Command;
            client.registry.registerCommand(command)
        }
    }


    // TODO: Rewrite?
    const jsonCommands = client.dynamicData.commands.data;
    for (const g in jsonCommands) {
        // Maybe construct an instance of a Help command here and push that to
        // the command registry
        // also, if we actually implement categories, we can push `g` to that
        // array
    
        for (const c in jsonCommands[g]) {
            const command: Command = new Command({
                name: c,
                description: jsonCommands[g][c].description || "",
                category: g,
                execute: async (interaction: CommandInteraction) => {
                    interaction.editReply(jsonCommands[g][c].format || "");
                }
            })
            client.registry.registerCommand(command);
        }
    }

    const globalCommands = client.registry.commands.filter(i => !i.servers);

    for (const server of client.dynamicData.config.data.servers!) {
        const serverCommands = globalCommands.concat(client.registry.commands.filter(i => i.servers?.includes(server.alias || server.id)));
        await (await client.guilds.fetch(server.id))?.commands.set(JSON.parse(JSON.stringify(serverCommands)));
    }

    console.log(`Command handler initialised. Took ${Date.now() - before}ms.`);
}
