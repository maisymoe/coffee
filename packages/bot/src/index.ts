import { CoffeeClient, Intents } from "coffeelib";

export const client = new CoffeeClient({
    intents: [Intents.GUILDS],
    token: "",
});

client.login();