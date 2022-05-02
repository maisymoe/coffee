import { CoffeeBot } from "./lib/def";
import { Intents } from "discord.js";

import initCommandHandler from "./lib/commandHandler";
import initInteractionHandler from "./lib/interactionHandler";

export const client = new CoffeeBot({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    ws: { properties: { $browser: "Discord Android" } },
    http: { api: "https://canary.discord.com/api" },
    allowedMentions: {
        parse: ["users"],
    },
});

client.once("ready", () => {
    initCommandHandler();
    initInteractionHandler();
});

client.login(client.auth.token);