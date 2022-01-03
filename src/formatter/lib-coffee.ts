import { VM, Value, asString, asList, falseValue, wrapFunc } from "cumlisp";
import { VMContext } from "../formatter";
import { findMemberByReference, guildOfChannel } from "../lib/discord";

export function installCoffee(vm: VM, context: VMContext): void {
    vm.install({
        frien: wrapFunc("frien", 2, async (args: Value[]): Promise<Value> => {
            const guild = guildOfChannel(context.channel);
            const member1 = findMemberByReference(guild, asString(args[0]));
            const member2 = findMemberByReference(guild, asString(args[1]));

            if (member1 && member2)
                return `${member1.nickname || member1.user.username} is friens with ${
                    member2.nickname || member2.user.username
                }`;

            return falseValue;
        }),
        "frien-list": wrapFunc("frien-list", 1, async (args: Value[]): Promise<Value> => {
            const guild = guildOfChannel(context.channel);
            const listOfFriens = asList(args[0]);

            if (listOfFriens.length > 0)
                return `These people are all friends: ${listOfFriens
                    .map((m) => {
                        const member = findMemberByReference(guild, asString(m));
                        return member?.nickname || member?.user.username;
                    })
                    .join(", ")}`;

            return falseValue;
        }),
        "everything": wrapFunc("everything", 0, async (args: Value[]): Promise<Value> => {
            return "frick you tymon";
        }),
    });
}
