import { GatewayIntentBits } from "discord.js";
import { make } from "nests";
import { CoffeeClient } from "./def";
import commandHandler from "./handlers/command";
import interactionHandler from "./handlers/interaction";
import getConfig from "./lib/getConfig";

export const client = new CoffeeClient({ 
    intents: [GatewayIntentBits.Guilds], 
    config: make(getConfig()),
});

client.once("ready", async () => {
    console.log("Coffee is initialising...");

    await commandHandler();
    await interactionHandler();

    console.log("Coffee is ready!");
});

client.login(client.config.ghost.token);