import { resolveColor, EmbedBuilder } from "discord.js";
import { ErrorEmbedOptions, GenericEmbedOptions } from "../def";

export function createGenericEmbed({ title, description, footer, fields, color }: GenericEmbedOptions): EmbedBuilder {
    const embed = new EmbedBuilder()
        .setColor(resolveColor(color));

    if (title) {
        embed.setTitle(title);
    }

    if (description) {
        embed.setDescription(description);
    }

    if (footer) {
        embed.setFooter(footer);
    }

    if (fields) {
        embed.setFields(fields);
    }

    return embed;
}

export function createErrorEmbed({ title, description, fields }: ErrorEmbedOptions): EmbedBuilder {
    return createGenericEmbed({
        title: title ?? "",
        description: description ?? "",
        fields: fields ?? [],
        color: "Red",
    });
}