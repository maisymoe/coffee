import { ApplicationCommandData, Collection } from "discord.js";
import path from "path";
import fs from "fs";

import config from "../config/";

import { Command } from "../lib/def";
import { client } from "../index";

export const commands = new Collection<string, Command>();

export default async function init() {
    const before = Date.now();
    const commandFolder = path.join(__dirname, "../", "commands/");
    const commandFolders = fs.readdirSync(commandFolder);

    for (const folder of commandFolders) {
        const commandFiles = fs
            .readdirSync(path.join(commandFolder, folder))
            .filter((file) => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = (
                await import(path.join(commandFolder, folder, file))
            ).default as Command;
            commands.set(command.name, command);
        }
    }
    console.log(
        `Successfully fetched ${
            Array.from(commands.values()).length
        } command(s).`
    );

    if (!client.application?.owner) client.application?.fetch();
    let commandsToRegister: ApplicationCommandData[] = [];

    for (const command of commands.values()) {
        commandsToRegister.push({
            name: command.name,
            description: command.description || "",
            options: command.options,
            type: command.type || "CHAT_INPUT",
        });
    }

    for (const id of config.servers) {
        client.guilds.cache.get(id)?.commands.set(commandsToRegister);
    }
    console.log(`Command handler initialised. Took ${Date.now() - before}ms.`);
}
