import { join } from "path";
import { readdirSync } from "fs";

import config from "../config";
import { client } from "..";
import { Command } from "../lib/def";

export const commands = new Array<Command>();

export default async () => {
    const before = Date.now();
    const commandFolder = join(__dirname, "../", "commands/");
    const commandFolders = readdirSync(commandFolder);

    for (const folder of commandFolders) {
        const commandFiles = readdirSync(join(commandFolder, folder)).filter(i => i.endsWith(".js"));
        for (const file of commandFiles) {
            const command = (await import(join(commandFolder, folder, file)))
                .default as Command;
            commands.push(command);
        }
    }

    const globalCommands = commands.filter(i => !i.servers);

    for (const server of config.servers) {
        const serverCommands = globalCommands.concat(commands.filter(i => { i.servers?.includes(server.alias || server.id) }));
        await (await client.guilds.fetch(server.id))?.commands.set(JSON.parse(JSON.stringify(serverCommands)));
    }

    console.log(
        `Successfully fetched ${commands.length} command(s), and registered them in ${config.servers.length} server(s).`
    );

    console.log(`Command handler initialised. Took ${Date.now() - before}ms.`);
}
