import { GatewayIntentBits } from "discord.js";
import { CoffeeClient } from "./def";
import { getConfig } from "./lib/config";
import { readFileSync } from "fs";
import { join } from "path";

import commandHandler from "./handlers/command";
import interactionHandler from "./handlers/interaction";
import { getGitInfo, getSudoInsults, resolveActivityType } from "./lib/common";

export const client = new CoffeeClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    ws: { properties: { browser: "Discord Android" } }, 
    config: getConfig(),
    package: JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"))
});

client.once("ready", async () => {
    console.log("Coffee is initialising...");

    client.gitInfo = await getGitInfo();
    client.insults = await getSudoInsults();

    await commandHandler();
    await interactionHandler();

    client.user?.setActivity(client.config.activity.name, { type: resolveActivityType(client.config.activity.type) });

    console.log("Coffee is ready!");
});

client.login(client.config.token);