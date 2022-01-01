import { Client, ClientOptions, Intents } from "discord.js";

const browser = "Discord Android";
import commandHandler from "./handlers/commandHandler";
import interactionHandler from "./handlers/interactionHandler";
import { configCheck } from "./lib/common";

import auth from "../data/auth.json";

import DynamicDataManager from "./dynamic-data";

class CoffeeBot extends Client {
    public dynamicData: DynamicDataManager;

    public constructor(co: ClientOptions) {
        super(co);
        this.dynamicData = new DynamicDataManager();
    }
}

export const client = new CoffeeBot({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    ws: { properties: { $browser: browser } },
    http: { api: "https://canary.discord.com/api" },
    allowedMentions: {
        parse: ["users"],
    }
});

client.on("ready", async () => {
    await configCheck();
    console.log("Client is ready, initialising handlers...");
    await commandHandler();
    await interactionHandler();

    console.log("Setting activity...");
    client.user?.setActivity(client.dynamicData.config.data.activity);

    console.log("Done!");
});

client.login(auth.token);
