import {VM, Value, asString, falseValue, wrapFunc} from "cumlisp"
import {Channel, Client, Guild, GuildChannel, MessageEmbedOptions, User} from "discord.js"
import {findMemberByReference, queryClosestEmoteName, TextBasedChannel} from "../lib/discord"

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

function guildOfChannel(channel: Channel): Guild | undefined {
    return channel instanceof GuildChannel ? channel.guild : undefined;
}

export function installDiscord(vm: VM, context: VMContext): void {
    vm.install({
        'find-user': wrapFunc('find-user', 1, async (args: Value[]): Promise<Value> => {
            vm.consumeTime(vmFindUserTime);
            const res1 = asString(args[0]);
            const guild = guildOfChannel(context.channel);
            const res = findMemberByReference(guild, res1);
            if (res) return res.id;
            return falseValue;
        }),
        'emote': wrapFunc('emote', 1, async (args: Value[]): Promise<Value> => {
            const emote = queryClosestEmoteName(asString(args[0])).toString();
            if (emote) return emote;
            return falseValue;
        })
    });
}
