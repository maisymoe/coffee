import { Channel, GuildChannel, Guild, GuildMember, MessageMentions, TextBasedChannel, ChatInputCommandInteraction, User } from "discord.js";
import { Indexable, DiscordVMContext } from "../../def";
import { client } from "../..";

export function getVMContext(interaction: ChatInputCommandInteraction): DiscordVMContext {
    return {
        client: client,
        interaction: interaction,
        channel: interaction.channel as TextBasedChannel,
        author: interaction.user,
        args: [],
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

export async function findUserByReference(reference: string, guild?: Guild): Promise<User | undefined | null> {
    const mention = MessageMentions.UsersPattern.exec(reference);
    if (mention) return await client.users.fetch(mention[1]);

    let byId: User | undefined | null;
    try {
        byId = await client.users.fetch(reference);
    } catch {}
    if (byId) return byId;

    if (guild) {
        const byGuildQuery = await guild?.members.fetch({ query: reference, limit: 1 });
        if (byGuildQuery?.first()) return byGuildQuery?.first()?.user;
    }

    const candidates = Array.from((await client.users.cache)!.filter((cand: User) => {
        return (
            cand.username.includes(reference) ||
            reference == cand.tag ||
            reference == cand.id
        )
    }).values())

    if (candidates.length !== 0) return candidates[0];

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