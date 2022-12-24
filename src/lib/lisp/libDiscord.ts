import { User } from "discord.js";
import { VM, Value, wrapFunc, asString } from "cumlisp";
import { DiscordVMContext, Indexable } from "../../def";
import { findUserByReference, guildOfChannel, queryClosestEmoteName } from "./utils";

const allowedTypes = ["string", "number"];

function getMemberKey(member: User & Indexable | null | undefined, key: string) {
    if (!member) throw new Error(`Unable to find user ${member}`);

    const foundProp = member[key];

    if (typeof foundProp === "undefined") {
        throw new Error(`Property ${key} is undefined`);
    }

    if (!allowedTypes.includes(typeof foundProp)) throw new Error(`Property ${key} is not one of ${allowedTypes.join(", ")}`);

    return foundProp;
}

export function installDiscord(vm: VM, context: DiscordVMContext) {
    vm.install({
        "user": wrapFunc("user", 2, async (args: Value[]): Promise<Value> => {
            vm.consumeTime(128);

            const guild = guildOfChannel(context.channel);
            const user: User & Indexable | null | undefined = await findUserByReference(asString(args[0]), guild);

            return getMemberKey(user, asString(args[1]));
        }),
        "author": wrapFunc("author", 1, async (args: Value[]): Promise<Value> => {
            vm.consumeTime(128);
            
            const user: User & Indexable | null | undefined = context.author;

            return getMemberKey(user, asString(args[0]));
        }),
        "emote": wrapFunc("emote", 1, async (args: Value[]): Promise<Value> => {
            const name = asString(args[0]);
            const emote = queryClosestEmoteName(name)?.toString();

            if (!emote) throw new Error(`No emote with name ${name} could be found.`);

            return emote;
        })
    })
}