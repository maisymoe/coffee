import { Command } from "../../lib/def";
import { CommandInteraction, Formatters } from "discord.js";

import { createStatusEmbed } from "../../lib/embeds";
import { reply } from "../../lib/common";

import { exec } from "child_process";
import { promisify } from "util";
const execPromise = promisify(exec);

export default new Command({
    name: "exec",
    description: "Run a command in the bot's shell - only available to developers!",
    su: true,
    options: [
        {
            name: "command",
            description: "The command to run.",
            type: "STRING",
            required: true,
        }
    ],
    callback: async (interaction: CommandInteraction) => {
        const command = interaction.options.getString("command", true);
        const before = Date.now();

        let took;
        let embed;

        try {
            const { stdout, stderr } = await execPromise(command);
            took = Date.now() - before;

            embed = createStatusEmbed("success", "Success!", [
                {
                    name: "Time",
                    value: `${took}ms`,
                    inline: true,
                },
                {
                    name: "Stdin",
                    value: Formatters.codeBlock("sh", command.substring(0, 1000)),
                },
            ]);

            if (stdout) {
                embed.fields.push({
                    name: "Stdout",
                    value: Formatters.codeBlock("sh", stdout.substring(0, 1000)),
                    inline: false,
                });
            }

            if (stderr) {
                embed.fields.push({
                    name: "Stderr",
                    value: Formatters.codeBlock("sh", stderr.substring(0, 1000)),
                    inline: false,
                });
            }
        } catch(e) {
            const typedError = e as Error;

            embed = createStatusEmbed("error", "Error...", [
                {
                    name: "Command",
                    value: Formatters.codeBlock("sh", command.substring(0, 1000)),
                },
                {
                    name: "Error",
                    value: Formatters.codeBlock("sh", typedError.toString().substring(0, 1000)),
                }
            ]);
        }

        return await reply(interaction, { embeds: [embed!] });
    }
});
