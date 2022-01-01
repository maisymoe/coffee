import { Client, ClientOptions, Intents } from "discord.js";

const browser = "Discord Android";
import commandHandler from "./handlers/commandHandler";
import interactionHandler from "./handlers/interactionHandler";

import config from "./config/";
import auth from "./config/auth";
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

console.log(client.dynamicData.commands)
console.log(client.dynamicData.commands.data)

client.on("ready", async () => {
    console.log("Client is ready, initialising handlers...");
    await commandHandler();
    await interactionHandler();

    console.log("Setting activity...");
    client.user?.setActivity(config.activity);

    console.log("Done!");
});

client.login(auth.discord.token);
