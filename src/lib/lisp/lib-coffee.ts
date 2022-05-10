import { VM, Value, asString, wrapFunc, falseValue } from "cumlisp";
import { DiscordVMContext } from "../def";
import meta from "../../../package.json";

type MetaType = {
    [key: string]: string;
}

function randomStr(len: number, arr: string) {
    let ans = "";
    for (let i = len; i > 0; i--) {
        ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}

export function installCoffee(vm: VM, context: DiscordVMContext) {
    vm.install({
        "meta": wrapFunc("meta", 1, async (args: Value[]): Promise<Value> => {
            const availableMeta: MetaType = {
                "name": meta.name,
                "version": meta.version,
                "description": meta.description,
                "author": meta.author,
                "license": meta.license,
            }

            const name = asString(args[0]);

            if (name in availableMeta) {
                return availableMeta[name];
            } else {
                throw new Error(`No meta data found for "${name}"`);
            };
        }),
        "dep-ver": wrapFunc("dep-ver", 1, async (args: Value[]): Promise<Value> => {
            const name = asString(args[0]);

            const mergedDeps: MetaType = {
                ...meta.dependencies,
                ...meta.devDependencies,
            }

            if (name in mergedDeps) {
                return mergedDeps[name];
            } else {
                throw new Error(`Dependency "${name}" not found`);
            };
        }),
        "give-token": wrapFunc("give-token", 0, async (args: Value[]): Promise<Value> => {
            return randomStr(71, "ABCDEFGHIkLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789");
        }),
    });
};