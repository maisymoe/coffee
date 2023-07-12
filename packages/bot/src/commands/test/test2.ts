import { Command } from "coffeelib";

export default new Command({
    name: "test2",
    description: "this is another nice test command",
    handler: () => {
        throw new Error("we fucking exploded");
    }
})