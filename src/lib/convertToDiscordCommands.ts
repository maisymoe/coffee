import { ApplicationCommandData, ApplicationCommandType } from "discord.js";
import { Command } from "../def";

export default function convertToDiscordCommands(commands: Command[]) {
    const convertedCommands = [];

    for (const command of commands) {
        convertedCommands.push({
            name: command.name,
            description: command.description,
            options: command.options,
            type: ApplicationCommandType.ChatInput,
        } as ApplicationCommandData);
    }

    return convertedCommands;
}