import { ApplicationCommandOptionType, codeBlock, cleanCodeBlockContent } from "discord.js";
import { exec } from "child_process";
import { promisify } from "util";
import { Command } from "../../def";
import { createStatusEmbed } from "../../lib/embeds";

const execPromise = promisify(exec);

export default new Command({
    name: "exec",
    description: "Run a command in the bot's shell - for developers!",
    su: true,
    noAck: true,
    options: [
        {
            name: "command",
            description: "The command to run",
            required: true,
            type: ApplicationCommandOptionType.String,
        },
        {
            name: "silent",
            description: "Don't send the output to the channel",
            type: ApplicationCommandOptionType.Boolean,
        }
    ],
    handler: async (interaction) => {
        const command = interaction.options.getString("command", true);
        const silent = interaction.options.getBoolean("silent");
        const before = Date.now();

        let took;
        let embed;

        await interaction.deferReply({ ephemeral: silent ?? false });

        try {
            const { stdout, stderr } = await execPromise(command);
            took = Date.now() - before;

            embed = createStatusEmbed({
                type: "success", 
                fields: [
                    { name: "Time", value: `${took}ms`, inline: true },
                    { name: "Stdin", value: codeBlock("ansi", cleanCodeBlockContent(command.substring(0, 1000))), inline: false },
                ]
            });

            if (stdout) {
                embed.addFields([{ name: "Stdout", value: codeBlock("ansi", cleanCodeBlockContent(stdout.substring(0, 1000))), inline: false }]);
            }

            if (stderr) {
                embed.addFields([{ name: "Stderr", value: codeBlock("ansi", cleanCodeBlockContent(stderr.substring(0, 1000))), inline: false }]);
            }
        } catch (error) {
            const typedError = error as Error;

            embed = createStatusEmbed({
                type: "error",
                fields: [
                    { name: "Stdin", value: codeBlock("ansi", cleanCodeBlockContent(command.substring(0, 1000))), inline: false },
                    { name: "Error", value: codeBlock("ansi", cleanCodeBlockContent(typedError.toString().trim().substring(0, 1000))), inline: false },
                ]
            });
                
        }

        await interaction.editReply({ embeds: [embed] });
    },
})