import { join, dirname, fromFileUrl } from "https://deno.land/std@0.193.0/path/win32.ts";
import { CoffeeClient, Events, Intents, setupCommandHandler } from "coffeelib";
import config from "../config.json" assert { type: "json" };

export const client = new CoffeeClient({
    intents: [Intents.GUILDS],
    token: config.token,
});

client.on(Events.Ready, async () => {
    console.log("Client ready!");
    await setupCommandHandler(client, join(dirname(fromFileUrl(import.meta.url)), "commands"));
});

client.login();