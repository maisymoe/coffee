import { Client, ClientOptions, CommandInteraction, Intents } from "discord.js";

const browser = "Discord Android";
import commandHandler from "./handlers/commandHandler";
import interactionHandler from "./handlers/interactionHandler";
import { configCheck } from "./lib/common";

import auth from "../data/auth.json";

import DynamicDataManager from "./dynamic-data";
import { CommandRegistry } from "./command-registry";

export class CoffeeBot extends Client {
    public dynamicData: DynamicDataManager;
    public registry: CommandRegistry;

    public constructor(co: ClientOptions) {
        super(co);
        this.dynamicData = new DynamicDataManager();
        this.registry = new CommandRegistry(this);
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
    await commandHandler(client);
    await interactionHandler(client);

    console.log("Setting activity...");
    client.user?.setActivity(client.dynamicData.config.data.activity);

    console.log("Done!");
});

client.login(auth.token);
