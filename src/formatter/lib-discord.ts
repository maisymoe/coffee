import { VM, Value, asString, falseValue, wrapFunc } from "cumlisp";
import { Client, User } from "discord.js";
import { findMemberByReference, queryClosestEmoteName, guildOfChannel, TextBasedChannel } from "../lib/discord";

const vmFindUserTime = 128;

export interface VMContext {
    client: Client;
    channel: TextBasedChannel;
    // The person whose code we are running.
    writer: User | null;
    cause: User;
    protectedContent: boolean;
    args: Value[];
    // TODO: embeds?
}

export function installDiscord(vm: VM, context: VMContext): void {
    vm.install({
        "find-user": wrapFunc("find-user", 1, async (args: Value[]): Promise<Value> => {
            vm.consumeTime(vmFindUserTime);
            const res1 = asString(args[0]);
            const guild = guildOfChannel(context.channel);
            const res = findMemberByReference(guild, res1);
            if (res) return res.id;
            return falseValue;
        }),
        "user-name": wrapFunc("user-name", 1, async (args: Value[]): Promise<Value> => {
            vm.consumeTime(vmFindUserTime);
            const res1 = asString(args[0]);
            const guild = guildOfChannel(context.channel);
            const res = findMemberByReference(guild, res1);
            if (res) return res.nickname || res.user.username;
            return falseValue;
        }),
        "emote": wrapFunc("emote", 1, async (args: Value[]): Promise<Value> => {
            const emote = queryClosestEmoteName(asString(args[0])).toString();
            if (emote) return emote;
            return falseValue;
        }),
        "author-name": wrapFunc("author-name", 0, async (): Promise<Value> => {
            const guild = guildOfChannel(context.channel);
            const member = findMemberByReference(guild, context.writer!.id);

            if (member) return member.nickname || member.user.username;

            return falseValue;
        }),
    });
}
