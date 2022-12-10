import { resolveColor, EmbedBuilder, ColorResolvable } from "discord.js";
import { client } from "..";
import { StatusEmbedOptions } from "../def";

export function createStatusEmbed({ type, title, description, fields, footer, color }: StatusEmbedOptions): EmbedBuilder {
    let colorFromType: ColorResolvable;

    if (!color) {
        switch(type) {
            case "info":
                colorFromType = client.constants!.palette.accent;
            break;
            case "success":
                colorFromType = client.constants!.palette.success;
            break;
            case "warn":
                colorFromType = client.constants!.palette.warn;
            break;
            case "error":
                colorFromType = client.constants!.palette.error;
            break;
        }
    } else {
        colorFromType = color;
    }

    const embed = new EmbedBuilder({
        title: title,
        description: description,
        fields: fields,
        footer: footer,
        color: resolveColor(colorFromType)
    });
    
    return embed;
}