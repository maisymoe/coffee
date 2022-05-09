import { VM, Value, asString, wrapFunc, falseValue } from "cumlisp";
import { DiscordVMContext } from "../def";
import meta from "../../../package.json";

export function installCoffee(vm: VM, context: DiscordVMContext) {
    vm.install({
        // "meta": wrapFunc("meta", 1, async (args: Value[]): Promise<Value> => {
        //     const whitelistedKeys = ["name", "description", "version", "author", "license"];
        //     const name = asString(args[0]);

        //     if (whitelistedKeys.includes(name)) {
        //         const operableKeys = Object.entries(meta);
        //         const itemIndex = operableKeys.indexOf([name, ""]);
        //         return asString(operableKeys[itemIndex]);
        //     };

        //     return falseValue;
        // }),
        "hello": wrapFunc("hello", 0, async (args: Value[]): Promise<Value> => {
            return "Hello, world! (this is a placeholder until lib-coffee is more functional)";
        }),
    });
};