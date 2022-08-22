import { promisify } from "util";
import { exec as _exec } from "child_process";
import { $fetch } from "ohmyfetch";
import { ApplicationCommandData, ApplicationCommandType, CommandInteraction, ActivityType, codeBlock } from "discord.js";
import { client } from "..";
import { ActivityTypeResolvable, Command, GitInfo } from "../def";
import { createErrorEmbed } from "./embeds";

const exec = promisify(_exec);

export function convertToDiscordCommands(commands: Command[]) {
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

export async function logError(interaction: CommandInteraction, error: Error) {
    console.error(error);

    const logChannel = await client.channels.fetch(client.config.channels.log);
    const errorEmbed = createErrorEmbed({
        fields: [
            {
                name: "Command",
                value: codeBlock(`/${interaction.commandName} ${interaction.options.data.map(o => `${o.name}:${o.value}`).join(" ")}`.substring(0, 1000)),
                inline: false,
            },
            {
                name: "User",
                value: interaction.user.toString(),
                inline: true,
            },
            {
                name: "Guild",
                value: interaction.inGuild() ? `${interaction.guild?.name} (${interaction.guild?.id})` : "DM",
                inline: true,
            },
            {
                name: "Error",
                value: codeBlock("js", (error.stack || error.message || error.toString()).substring(0, 1000)),
                inline: false,
            }
        ],
    });

    logChannel?.isTextBased() && logChannel?.send({ embeds: [errorEmbed] });
}

export function resolveActivityType(type: ActivityTypeResolvable): number {
    if (typeof type === "string") {
        switch (type.toLowerCase()) {
            case "playing":
                return ActivityType.Playing;
            case "streaming":
                return ActivityType.Streaming;
            case "listening":
                return ActivityType.Listening;
            case "watching":
                return ActivityType.Watching;
            case "custom":
                return ActivityType.Custom;
            case "competing":
                return ActivityType.Competing;
            default:
                throw new Error(`Unknown activity type: ${type}`);
        }
    } else {
        return type;
    }
}

export async function getGitInfo(): Promise<GitInfo> {
    const branch = (await exec("git rev-parse --abbrev-ref HEAD")).stdout.trim();
    const commit = (await exec("git rev-parse HEAD")).stdout.trim();

    return {
        branch,
        commit,
    };
}

export async function getSudoInsults() {
    try {
        const insults = await $fetch("https://uwu.network/insults.txt/");
        return insults.split("\n");   
    } catch (error) {
        return [];
    }
}