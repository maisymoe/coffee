import { SelectMenuInteraction } from 'discord.js';
import { SelectMenu } from '../../../lib/def';

export default new SelectMenu({
    id: 'select',
    ephemeral: true,
    async execute(interaction: SelectMenuInteraction): Promise<any> {
        console.log(interaction.values)
        return await interaction.editReply(`hello <@${interaction.user.id}>, you picked ${interaction.values[0]}`);
    }
})