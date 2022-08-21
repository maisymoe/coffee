import { ActivityType, GatewayIntentBits } from "discord.js";
import { CoffeeClient } from "./def";
import { getConfig } from "./lib/config";
import { readFileSync } from "fs";
import { join } from "path";

import commandHandler from "./handlers/command";
import interactionHandler from "./handlers/interaction";

export const client = new CoffeeClient({
    intents: [GatewayIntentBits.Guilds],
    ws: { properties: { browser: "Discord Android" } }, 
    config: getConfig(),
    package: JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"))
});

client.once("ready", async () => {
    console.log("Coffee is initialising...");

    await commandHandler();
    await interactionHandler();

    // TODO: Allow defining the activity type
    client.user?.setActivity(client.config.activity.name, { type: ActivityType.Competing });

    console.log("Coffee is ready!");
});

client.login(client.config.token);