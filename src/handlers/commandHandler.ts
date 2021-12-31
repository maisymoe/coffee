import { join } from "path";
import { readdirSync } from "fs";

import config from "../config";
import { client } from "..";
import { Command, JSONCommandFile } from "../lib/def";
import { CommandInteraction } from "discord.js";

export const commands = new Array<Command>();

export default async () => {
    const before = Date.now();
    const commandFolder = join(__dirname, "../", "commands/");
    const commandFolders = readdirSync(commandFolder);

    for (const folder of commandFolders) {
        if (folder.endsWith(".json")) continue;
        const commandFiles = readdirSync(join(commandFolder, folder)).filter(i => i.endsWith(".js"));
        for (const file of commandFiles) {
            const command = (await import(join(commandFolder, folder, file)))
                .default as Command;
            commands.push(command);
        }
    }

    const jsonCommands: JSONCommandFile = (await import("../commands/commands.json")).default;
    for (const g in jsonCommands) {
        // Maybe construct an instance of a Help command here and push that to
        // the command registry
        // also, if we actually implement categories, we can push `g` to that
        // array
        for (const k in jsonCommands[g]) {
            console.log(`Registering JSON command "${k}" of category "${g}"`)
            const cmd: Command = new Command({
                name: k,
                description: jsonCommands[g][k].description || "No Description",
                category: g,
                execute: async (interaction: CommandInteraction) => {
                    interaction.editReply(jsonCommands[g][k].format || "")
                }
            })
            commands.push(cmd)
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
