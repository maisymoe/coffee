import * as core from "npm:@discordjs/core";
import * as formatters from "npm:@discordjs/formatters";
import { REST } from "npm:@discordjs/rest";
import { WebSocketManager } from "npm:@discordjs/ws";

export const DJS = {
    ...core,
    REST,
    WebSocketManager,
    formatters,
}

export * as Discord from "npm:discord-api-types/v10";

export { join, dirname, toFileUrl } from "https://deno.land/std@0.193.0/path/mod.ts";