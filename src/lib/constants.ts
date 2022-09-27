import { TextChannel, ActivityType } from "discord.js";
import { client } from "..";
import { Constants, GitInfo, ActivityTypeResolvable } from "../def";
import { promisify } from "util";
import { exec as _exec } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";
import { $fetch } from "ohmyfetch";

const exec = promisify(_exec);

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
        return ["There would be an insult here, but it couldn't be fetched."];
    }
}

export default async function getConstants(): Promise<Constants> {
    const resolvedUsers = [];

    for (const id of client.config.users) resolvedUsers.push(await client.users.fetch(id));

    return {
        users: resolvedUsers,
        guild: await client.guilds.fetch(client.config.guild),
        channels: {
            log: (await client.channels.fetch(client.config.channels.log)) as TextChannel,
        },
        activity: {
            name: client.config.activity.name,
            type: resolveActivityType(client.config.activity.type),
        },
        package: JSON.parse(readFileSync(join(__dirname, "../", "../", "package.json"), "utf8")),
        gitInfo: await getGitInfo(),
        insults: await getSudoInsults(),
    }
}