import { ApplicationCommandOptionType, inlineCode } from "discord.js";
import { client } from "../../../";
import { Subcommand } from "../../../def";
import { createStatusEmbed } from "../../../lib/embeds";

export default new Subcommand({
  name: "timeout",
  description: "Timeout yourself.",
  options: [
    {
      name: "for",
      description: "Time to timeout you for, in seconds",
      maxValue: 28 * 24 * 60 * 60,
      minValue: 2 * 60,
      required: true,
      type: ApplicationCommandOptionType.Integer,
    },
    {
      name: "reason",
      description: "Why are you timing yourself out? (optional)",
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "silent",
      description:
        "Whether to show the timeout message for everyone in this channel (default: true)",
      type: ApplicationCommandOptionType.Boolean,
    },
  ],
  handler: async (interaction) => {
    if (!interaction.inGuild()) {
      await interaction.editReply({
        embeds: [
          createStatusEmbed({
            type: "error",
            description: `You can't timeout yourself in a DM.`,
          }),
        ],
      });
      return;
    }
    if (!interaction.guild) return;
    const options = {
      for: interaction.options.getInteger("for", true),
      reason: interaction.options.getString("reason"),
      ephemeral: interaction.options.getBoolean("silent") ?? false,
    };

    const member = await interaction.guild.members.fetch({
      user: interaction.user,
      cache: false,
    });

    member
      .timeout(
        options.for,
        `${
          options.reason ? "No reason specified" : options.reason
        } (/selfmod timeout)`
      )
      .then(() =>
        interaction
          .editReply({
            embeds: [
              createStatusEmbed({
                type: "success",
                description:
                  `Successfully timed you out.\n` +
                  `See you <t:${options.for}:R>`,
              }),
            ],
          })
          .catch(console.error)
      )
      .catch((e) =>
        interaction
          .editReply({
            embeds: [
              createStatusEmbed({
                type: "error",
                description: `Sorry i can't time you out, ${e.message}`,
              }),
            ],
          })
          .catch(console.error)
      );
  },
});
