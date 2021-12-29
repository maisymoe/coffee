import {TextChannel, NewsChannel, DMChannel, GuildChannel, Channel, Guild, GuildMember} from "discord.js"
import { client } from "../index"

// Helpers for Discord stuff

export type GuildTextBasedChannel = TextChannel | NewsChannel;
export function isGuildChannelTextBased(channel: GuildChannel): channel is GuildTextBasedChannel {
    return channel instanceof TextChannel || channel instanceof NewsChannel;
}

export type TextBasedChannel = GuildTextBasedChannel | DMChannel;
export function isChannelTextBased(channel: Channel): channel is TextBasedChannel {
    return channel instanceof DMChannel || isGuildChannelTextBased(channel as GuildChannel);
}

export const mentionRegex = /<@!?([0-9]*)>/g;
export function findMemberByReference(guild: Guild | undefined | null, reference: string): GuildMember | null {
    if (!guild) return null;

    const mention = mentionRegex.exec(reference);
    if (mention) return guild.members.cache.get(mention[1]) || null;

    const byId = guild.members.cache.get(reference);
    if (byId) return byId;

    // const candidates = guild.members.cache.filter((cand: GuildMember): boolean => {
    //     return (cand.user.username.includes(reference)) || (reference == (`${cand.user.username}#${cand.user.discriminator}`)) || (reference == cand.user.id) || (reference == cand.nickname);
    // })
    const candidatesColl = guild.members.cache.filter((cand: GuildMember): boolean => {
        return (cand.user.username.includes(reference)) || (reference == (`${cand.user.username}#${cand.user.discriminator}`)) || (reference == cand.user.id) || (reference == cand.nickname);
    })
    const candidates = Array.from(candidatesColl.values());
    if (candidates.length == 1) return candidates[0];
    return null;
}

export function guildOfChannel(channel: Channel): Guild | undefined {
    return channel instanceof GuildChannel ? channel.guild : undefined;
}

export function compareEmoteNames(emote: string, query: string): number {
    let likeness = -Math.abs(emote.length - query.length);
    const isQueryLonger = query.length > emote.length;

    for (let i = 0; i < (isQueryLonger ? emote.length : query.length); i++) {
        const c = emote[i];
        const q = query[i];

        // If they're the exact same character
        if (c === q) likeness += 1.5;
        // If the emote is uppercase but the query is lowercase
        else if (c === q.toUpperCase()) likeness += 1;
        // If the emote is lowercase but the query is uppercase
        else if (c === q.toLowerCase()) likeness += 0.5;
    }

    return likeness;
}

export function queryClosestEmoteName(query: string) {
    const priorityTable: {[id: string]: number} = {};

    for (const emote of client.emojis.cache.values()) priorityTable[emote.id] = compareEmoteNames(emote.name!, query);

    const resultingIDs = Object.keys(priorityTable).sort((a, b) => priorityTable[b] - priorityTable[a]);
    return client.emojis.cache.get(resultingIDs[0])!;
}
