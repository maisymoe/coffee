import { CoffeeBot } from "..";
import EvalCommand from "../commands/developer/eval";
import TestCommand from "../commands/test/test";
import ReloadCommand from "../commands/utility/reload";
import SayCommand from "../commands/utility/say";

export async function submitCommands(client: CoffeeBot) {
    const globalCommands = client.registry.commands.filter((i) => !i.servers);

    for (const server of client.dynamicData.config.data.servers!) {
        const serverCommands = globalCommands.concat(
            client.registry.commands.filter((i) => i.servers?.includes(server.alias || server.id)),
        );
        await (
            await client.guilds.fetch(server.id)
        )?.commands.set(JSON.parse(JSON.stringify(serverCommands)));
    }
}

export default async (client: CoffeeBot) => {
    const before = Date.now();
    client.registry
        .registerCommand(new EvalCommand(client))
        .registerCommand(new TestCommand(client))
        .registerCommand(new SayCommand(client))
        .registerCommand(new ReloadCommand(client));

    await submitCommands(client);

    console.log(`Command handler initialised. Took ${Date.now() - before}ms.`);
};
