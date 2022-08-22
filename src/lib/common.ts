import { promisify } from "util";
import { exec as _exec } from "child_process";
import { $fetch } from "ohmyfetch";
import { ApplicationCommandData, ApplicationCommandType, ChatInputCommandInteraction, ActivityType, UserFlagsString, TextBasedChannel, codeBlock, inlineCode, Guild, GuildMember, MessageMentions, Channel, GuildChannel } from "discord.js";
import { client } from "..";
import { ActivityTypeResolvable, Command, GitInfo, DiscordVMContext, Indexable } from "../def";
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

export async function logError(interaction: ChatInputCommandInteraction, error: Error) {
    console.error(error);
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

    client.constants?.channels.log.send({ embeds: [errorEmbed] });
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
        return ["There would be an insult here, but it couldn't be fetched."];
    }
}

export function getEmojiFromFlag(flag: UserFlagsString) {
    const emoji = client.constants?.guild.emojis.cache.find(e => e.name === flag);

    return emoji?.toString() ?? inlineCode(flag);
}

export function getVMContext(interaction: ChatInputCommandInteraction): DiscordVMContext {
    return {
        client: client,
        interaction: interaction,
        channel: interaction.channel as TextBasedChannel,
        author: interaction.user,
        args: []
    }
}

// Copyright (C) 2019-2020 CCDirectLink members
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

// LeaBot was used as reference here, many thanks!

export function guildOfChannel(channel: Channel): Guild | undefined {
    return channel instanceof GuildChannel ? channel.guild : undefined;
}

export async function findMemberByReference(guild: Guild | undefined | null, reference: string): Promise<GuildMember | undefined | null> {
    const mention = MessageMentions.UsersPattern.exec(reference);
    if (mention) return await guild?.members.fetch(mention[1]);

    let byId: GuildMember | undefined | null;
    try {
        byId = await guild?.members.fetch(reference);
    } catch {};
    if (byId) return byId;

    // const candidates = Array.from((await guild?.members.fetch())!.filter((cand: GuildMember) => {
    //     return (
    //         cand.user.username.includes(reference) ||
    //         reference == cand.user.tag ||
    //         reference == cand.user.id ||
    //         reference == cand.nickname
    //     )
    // }).values())

    const byQuery = await guild?.members.fetch({ query: reference, limit: 1 });
    if (byQuery?.first) return byQuery?.first();

    return null;
}

export function compareEmoteNames(emote: string, query: string): number {
    let likeness = -Math.abs(emote.length - query.length);
    
    for (let i = 0; i < ((query.length > emote.length) ? emote.length : query.length); i++) {
        const e = emote[i];
        const q = query[i];
     
        // If they're the exact same character
        if (e === q) likeness += 1.5;
        // If the emote is uppercase but the query is lowercase
        else if (e === q.toUpperCase()) likeness += 1;
        // If the emote is lowercase but the query is uppercase
        else if (e === q.toLowerCase()) likeness += 0.5;
    }

    return likeness;
}

export function queryClosestEmoteName(query: string) {
    const priorityTable: Indexable = {};

    for (const emote of client.emojis.cache.values()) priorityTable[emote.id] = compareEmoteNames(emote.name!, query);

    const resultingIDs = Object.keys(priorityTable).sort((a, b) => priorityTable[b] - priorityTable[a]);

    return client.emojis.cache.get(resultingIDs[0]);
}