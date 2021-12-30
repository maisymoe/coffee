import { CommandInteraction, MessageOptions } from "discord.js"
import { VM, VMContext, run } from "../../formatter"
import { client } from "../../index"
import { Command } from "../../lib/def"
import { TextBasedChannel } from "../../lib/discord"

interface SayResult {
  error: boolean;
  text: string;
  opts: MessageOptions & { split: false };
}

export async function say(code: string, vmContext: VMContext): Promise<SayResult | null> {
  let text: string;
  try {
    text = await run(code, new VM(vmContext));
  } catch (ex) {
    return {
      error: true,
      text: `**Formatting error**: \`${ex}\` (was the code correct?)`,
      opts: { split: false }
    }
  }

  const opts: MessageOptions & { split: false } = { split: false };
  let hasMeta = false;

  if ((text != "") || hasMeta)
    return {
      error: false,
      text,
      opts
    }

  return null
}

export default new Command({
  name: "say",
  description: "A say command capable of parsing LISP.",
  category: "utility",
  options: [
    {
      name: "text",
      description: "What to say. Allows LISP.",
      type: "STRING",
      required: true
    }
  ],
  async execute(interaction: CommandInteraction): Promise<any> {
    const text = interaction.options.getString("text")!;
    const sayResult = await say(text, {
      client: client,
      channel: interaction.channel as TextBasedChannel,
      cause: interaction.user,
      writer: interaction.user,
      protectedContent: false,
      args: []
    })
    if (sayResult) {
      return await interaction.editReply(`*${interaction.user.toString()} says:*\n${sayResult.text}`);
    }
  }
})
