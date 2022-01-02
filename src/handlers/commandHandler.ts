import { join } from "path";
import { readdirSync } from "fs";

import { CoffeeBot } from "..";
import { Command } from "../lib/def";

export async function submitCommands(client: CoffeeBot) {
    const globalCommands = client.registry.commands.filter(i => !i.servers);

    for (const server of client.dynamicData.config.data.servers!) {
        const serverCommands = globalCommands.concat(client.registry.commands.filter(i => i.servers?.includes(server.alias || server.id)));
        await (await client.guilds.fetch(server.id))?.commands.set(JSON.parse(JSON.stringify(serverCommands)));
    }
}

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

    await submitCommands(client);

    console.log(`Command handler initialised. Took ${Date.now() - before}ms.`);
}
