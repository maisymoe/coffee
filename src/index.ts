import { GatewayIntentBits } from "discord.js";
import { CoffeeClient } from "./def";
import { setupDataLink } from "./lib/data";

import getConstants from "./lib/constants";
import commandHandler from "./handlers/command";
import interactionHandler from "./handlers/interaction";
import tagsHandler from "./handlers/tags";

export const client = new CoffeeClient({
    intents: [GatewayIntentBits.Guilds],
    ws: { properties: { browser: "Discord Android" } }, 
    allowedMentions: { parse: ["users"] },
    config: setupDataLink("config"),
});

client.once("ready", async () => {
    console.log("Coffee is initialising...");

    client.constants = await getConstants();
    await commandHandler();
    await interactionHandler();
    await tagsHandler();

    client.user?.setActivity(client.constants.activity);

    console.log("Coffee is ready!");
});

client.login(client.config.token);