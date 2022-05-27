import { CoffeeBot } from "./lib/def";
import { ActivityOptions, Intents } from "discord.js";

import initCommandHandler from "./lib/handlers/commandHandler";
import initInteractionHandler from "./lib/handlers/interactionHandler";
import initTagHandler from "./lib/handlers/tagHandler";

export const client = new CoffeeBot({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    ws: { properties: { $browser: "Discord Android" } },
    http: { api: "https://canary.discord.com/api" },
    allowedMentions: {
        parse: ["users"],
    },
});

client.once("ready", async () => {
    await initCommandHandler();
    await initInteractionHandler();
    await initTagHandler();

    client.user?.setActivity(client.config.activity as ActivityOptions);
});

client.login(client.config.auth.token);
