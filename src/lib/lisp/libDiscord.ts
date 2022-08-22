import { VM, Value, wrapFunc, asString } from "cumlisp";
import { GuildMember } from "discord.js";
import { DiscordVMContext, Indexable } from "../../def";
import { findMemberByReference, guildOfChannel, queryClosestEmoteName } from "../common";

const allowedTypes = ["string", "number"];

// TODO: Merge member and user object somehow so LISP users can get user-specific properties

function getMemberKey(member: GuildMember & Indexable | null | undefined, key: string) {
    if (!member) throw new Error(`Unable to find user ${member}`);

    const foundProp = member[key];

    if (typeof foundProp === "undefined") {
        throw new Error(`Property ${key} is undefined.`);
    }

    if (!allowedTypes.includes(typeof foundProp)) throw new Error(`Property ${key} is not one of ${allowedTypes.join(", ")}`);

    return foundProp;
}

export function installDiscord(vm: VM, context: DiscordVMContext) {
    vm.install({
        "user": wrapFunc("user", 2, async (args: Value[]): Promise<Value> => {
            vm.consumeTime(128);

            const guild = guildOfChannel(context.channel);
            const member: GuildMember & Indexable | null | undefined = await findMemberByReference(guild, asString(args[0]));

            return getMemberKey(member, asString(args[1]));
        }),
        "author": wrapFunc("author", 1, async (args: Value[]): Promise<Value> => {
            vm.consumeTime(128);

            const guild = guildOfChannel(context.channel);
            const member: GuildMember & Indexable | null | undefined = await findMemberByReference(guild, context.author.id);

            return getMemberKey(member, asString(args[0]));
        }),
        "emote": wrapFunc("emote", 1, async (args: Value[]): Promise<Value> => {
            const name = asString(args[0]);
            const emote = queryClosestEmoteName(name)?.toString();

            if (!emote) throw new Error(`No emote with name ${name} could be found.`)

            return emote;
        })
    })
}