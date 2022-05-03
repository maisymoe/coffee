import { join } from "path";
import { readdirSync } from "fs";

import { Command } from "./def";
import { client } from "..";

export const commands = new Array<Command>();

export default async function() {
    const rootCommandsDir = join(__dirname, "../", "commands/").trim();
    const commandSubDirs = readdirSync(rootCommandsDir);

    for (const subDir of commandSubDirs) {
        const commandFiles = readdirSync(join(rootCommandsDir, subDir)).filter(i => i.endsWith(".js"));
        for (const commandFile of commandFiles) {
            const command = (await import(join(rootCommandsDir, subDir, commandFile))).default;
            commands.push(command);
        }
    }

    const globalCommands = commands.filter(i => !i.devOnly);
    const syncedCommands = (await client.application!.commands.fetch()).toJSON();

    for (const syncedCommand of syncedCommands) {
        const command = globalCommands.find(gc => gc.name === syncedCommand.name);

        if (!command || command.devOnly) {
            console.log(`Deleting synced command ${syncedCommand.name}`);
            await client.application!.commands.delete(syncedCommand.id);
        } else if (!syncedCommands.map(c => c.name).includes(command.name)) {
            console.log(`Syncing local command ${command.name}`);
            await client.application!.commands.create(command);
        }
    }

    for (const guild of client.config.testGuilds) {
        await (await client.guilds.fetch(guild.id)).commands.set(commands);
    };

    console.log(`Loaded ${commands.length} command(s).`);
}