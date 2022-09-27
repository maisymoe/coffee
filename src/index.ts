import { GatewayIntentBits } from "discord.js";
import { CoffeeClient } from "./def";
import { getConfig } from "./lib/config";

import commandHandler from "./handlers/command";
import interactionHandler from "./handlers/interaction";
import getConstants from "./lib/constants";

export const client = new CoffeeClient({
    intents: [GatewayIntentBits.Guilds],
    ws: { properties: { browser: "Discord Android" } }, 
    allowedMentions: { parse: ["users"] },
    config: getConfig(),
});

client.once("ready", async () => {
    console.log("Coffee is initialising...");

    client.constants = await getConstants();
    await commandHandler();
    await interactionHandler();

    client.user?.setActivity(client.constants.activity);

    console.log("Coffee is ready!");
});

client.login(client.config.token);