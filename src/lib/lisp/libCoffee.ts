import { inlineCode } from "discord.js";
import { VM, Value, wrapFunc, asString } from "cumlisp";
import { DiscordVMContext, Indexable } from "../../def";
import { client } from "../..";

const availableKeys = ["name", "version", "description", "author", "license", "respository", "bugs"];

export function installCoffee(vm: VM, context: DiscordVMContext) {
    vm.install({
        "package": wrapFunc("package", 1, async (args: Value[]): Promise<Value> => {
            const name = asString(args[0]);

            if (availableKeys.includes(name)) {
                return client.constants?.package[name];
            } else {
                throw new Error(`No data for ${inlineCode(name)} in package.json.`)
            }
        }),
        "dependency": wrapFunc("dependency", 1, async (args: Value[]): Promise<Value> => {
            const name = asString(args[0]);
            const mergedDeps: Indexable = { ...client.constants?.package.dependencies, ...client.constants?.package.devDependencies };

            if (name in mergedDeps) {
                return mergedDeps[name];
            } else {
                throw new Error(`Dependency ${inlineCode(name)} not found.`)
            }
        })
    })
}