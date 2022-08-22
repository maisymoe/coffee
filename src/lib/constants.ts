import { TextChannel } from "discord.js";
import { client } from "..";
import { Constants } from "../def";
import { resolveActivityType } from "./common";

export default async function getConstants(): Promise<Constants> {
    const resolvedUsers = [];

    for (const id of client.config.users) resolvedUsers.push(await client.users.fetch(id));

    return {
        users: resolvedUsers,
        guild: await client.guilds.fetch(client.config.guild),
        channels: {
            log: (await client.channels.fetch(client.config.channels.log)) as TextChannel,
        },
        activity: {
            name: client.config.activity.name,
            type: resolveActivityType(client.config.activity.type),
        },
    }
}