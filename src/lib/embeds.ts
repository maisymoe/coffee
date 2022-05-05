import { EmbedFieldData, MessageEmbed } from "discord.js";
import { client } from "..";

export function createStatusEmbed(type: "success" | "warn" | "error", description?: string, fields?: EmbedFieldData[]) {
    return new MessageEmbed({
        description: description,
        color: client.config.cosmetics.palette[type],
        fields: fields ? fields : [],
    });
}