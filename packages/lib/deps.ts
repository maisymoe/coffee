import * as core from "npm:@discordjs/core";
import { REST } from "npm:@discordjs/rest";
import { WebSocketManager } from "npm:@discordjs/ws";

export const DJS = {
    ...core,
    REST,
    WebSocketManager,
}

export * as Discord from "npm:discord-api-types/v10";