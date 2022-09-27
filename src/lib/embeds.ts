import { resolveColor, EmbedBuilder, ColorResolvable } from "discord.js";
import { StatusEmbedOptions } from "../def";

export function createStatusEmbed({ type, title, description, fields, footer, color }: StatusEmbedOptions): EmbedBuilder {
    let colorFromType: ColorResolvable;

    if (!color) {
        switch(type) {
            case "info":
                colorFromType = "Blurple";
            break;
            case "success":
                colorFromType = "Green";
            break;
            case "warn":
                colorFromType = "Yellow";
            break;
            case "error":
                colorFromType = "Red";
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