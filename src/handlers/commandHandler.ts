import { join } from "path";
import { readdirSync } from "fs";

import config from "../config";
import { client } from "..";
import { Command } from "../lib/def";

export const commands = new Array<Command>();

export default async function init() {
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

    console.log(
        `Successfully fetched ${
            Array.from(commands.values()).length
        } command(s).`
    );

    for (const id of config.servers) {
        client.guilds.cache.get(id)?.commands.set(JSON.parse(JSON.stringify(commands)));
    }
    console.log(`Command handler initialised. Took ${Date.now() - before}ms.`);
}
