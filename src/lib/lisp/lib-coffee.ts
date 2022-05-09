import { VM, Value, asString, wrapFunc, falseValue } from "cumlisp";
import { DiscordVMContext } from "../def";
import meta from "../../../package.json";

type MetaType = {
    [key: string]: string;
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
    });
};