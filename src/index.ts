import { GatewayIntentBits } from "discord.js";
import { CoffeeClient } from "./def";
import { getConfig } from "./lib/config";
import { readFileSync } from "fs";
import { join } from "path";
import { getGitInfo, getSudoInsults } from "./lib/common";

import commandHandler from "./handlers/command";
import interactionHandler from "./handlers/interaction";
import getConstants from "./lib/constants";

export const client = new CoffeeClient({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
    ws: { properties: { browser: "Discord Android" } }, 
    allowedMentions: { parse: ["users"] },
    config: getConfig(),
    package: JSON.parse(readFileSync(join(__dirname, "../package.json"), "utf8"))
});

client.once("ready", async () => {
    console.log("Coffee is initialising...");

    client.constants = await getConstants();
    client.gitInfo = await getGitInfo();
    client.insults = await getSudoInsults();

    await commandHandler();
    await interactionHandler();

    client.user?.setActivity(client.constants.activity);

    console.log("Coffee is ready!");
});

client.login(client.config.token);