import { Client, Intents } from "discord.js";

const browser = "Discord Android";
import commandHandler from "./handlers/commandHandler";
import interactionHandler from "./handlers/interactionHandler";
import componentHandler from "./handlers/componentHandler";

import config from "./config/";
import auth from "./config/auth";

export const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    ws: { properties: { $browser: browser } },
});

client.on("ready", async () => {
    console.log("Client is ready, initialising handlers...");
    await commandHandler();
    // await componentHandler();
    await interactionHandler();

    console.log("Setting activity...");
    client.user?.setActivity(config.activity);

    console.log("Done!");
});

client.login(auth.discord.token);
