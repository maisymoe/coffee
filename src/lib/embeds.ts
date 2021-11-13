import { MessageEmbed, EmbedField } from "discord.js";

export async function createErrorEmbed(title: string, description: string, fields?: EmbedField[], footer?: string): Promise<MessageEmbed> {
    const embed = new MessageEmbed()
        .setColor("RED")
        .setTitle(`Error - ${title}`)
        .setDescription(description);

    if (footer) embed.setFooter(footer);
    if (fields) embed.addFields(fields);

    return embed;
}