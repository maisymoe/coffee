import { ApplicationCommandType, ApplicationCommandData, ApplicationCommandOptionType } from "discord.js";
import { readdir } from "fs/promises";
import { join } from "path";
import { client } from "..";
import { Command } from "../def";

export const convert = (commands: Command[]): ApplicationCommandData[] => commands.map(c => ({ name: c.name, description: c.description, options: c.options, type: ApplicationCommandType.ChatInput }));
export const commands = new Array<Command>();

export default async function commandHandler() {
    const root = join(__dirname, "../", "commands/").trim();
    const categoryDirs = await readdir(root);

    for (const category of categoryDirs) {
        const categoryDir = await readdir(join(root, category));
        const commandFiles = categoryDir.filter(i => i.endsWith(".js"));
        const subcommandDirs = categoryDir.filter(i => !i.includes("."));

        for (const subcommand of subcommandDirs) {
            const subcommandFiles = (await readdir(join(root, category, subcommand))).filter(i => i.endsWith(".js") && i !== "meta.js");
            const subcommandData = await Promise.all(subcommandFiles.map(async i => ({ ...(await import(join(root, category, subcommand, i))).default })));
            const metaFile = (await import(join(root, category, subcommand, "meta.js"))).default;
            commands.push({ ...metaFile, options: subcommandData.map(i => ({ name: i.name, description: i.description, options: i.options, type: ApplicationCommandOptionType.Subcommand })), handler: subcommandData });
        }

        for (const commandFile of commandFiles) {
            const command = (await import(join(root, category, commandFile))).default;
            commands.push(command);
        }
    }

    client.application?.commands.set(convert(commands));
}