import { DJS, Discord, join, toFileUrl } from "../../deps.ts";
import { CoffeeClient } from "../client.ts";

type CommandCallback = (interaction: Discord.APIInteraction, api: typeof DJS.API.prototype) => void | Promise<void>;

interface ICommand {
    name: string;
    description: string;
    options?: Discord.APIApplicationCommandOption[];
    handler: CommandCallback | Subcommand[];
}

export class Command implements ICommand {
    public name: string;
    public description: string;
    public options?: Discord.APIApplicationCommandOption[];
    public handler: CommandCallback | Subcommand[];

    constructor(co: ICommand) {
        this.name = co.name;
        this.description = co.description;
        this.options = co.options;
        this.handler = co.handler;
    }
}

interface ISubcommand extends ICommand {
    handler: CommandCallback;
}

export class Subcommand extends Command implements ISubcommand  {
    public handler: CommandCallback;

    public constructor(sco: ISubcommand) {
        super(sco);
        this.options = sco.options;
        this.handler = sco.handler;
    }
}

// TODO: Probably export this elsewhere
export const commands = new Array<Command>;

const convert = (commands: Command[]): Discord.RESTPutAPIApplicationCommandsJSONBody => commands.map(c => ({
    name: c.name,
    description: c.description,
    options: c.options,
    type: DJS.ApplicationCommandType.ChatInput
}));

const commandFilter = (i: Deno.DirEntry) => i.isFile && i.name.endsWith(".ts");
const toFileString = (i: string) => toFileUrl(i).toString();

// TODO: Clean this function up a bit, there is some spaghetti-ish code here
// TODO: Somehow support non-relative paths, so devs don't need to do this:
// setupCommandHandler(join(dirname(fromFileUrl(import.meta.url)), "commands"), client.api);
export async function setupCommandHandler({ api }: CoffeeClient, commandsPath: string) {
    const categoryDirs = Deno.readDirSync(commandsPath);

    for (const categoryDir of categoryDirs) {
        if (categoryDir.isFile) throw new Error("Top-level commands are not supported!");

        const categoryData = Array.from(Deno.readDirSync(join(commandsPath, categoryDir.name)));
        const commandFiles = categoryData.filter(commandFilter);
        const subcommandDirs = categoryData.filter(i => i.isDirectory);

        for (const subcommandDir of subcommandDirs) {
            const subcommandFiles = Array.from(Deno.readDirSync(join(commandsPath, categoryDir.name, subcommandDir.name)))
                .filter(i => commandFilter(i) && i.name !== "meta.ts");
            
            const subcommandData: Subcommand[] = await Promise.all(subcommandFiles.map(async file => ({
                ...(await import(join(commandsPath, categoryDir.name, subcommandDir.name, file.name))).default,
            })));

            const metaFile: ICommand = (await import(toFileString(join(commandsPath, categoryDir.name, subcommandDir.name, "meta.ts")))).default;

            commands.push({ 
                ...metaFile,
                options: subcommandData.map(i => ({
                    name: i.name,
                    description: i.description,
                    options: i.options,
                    type: Discord.ApplicationCommandOptionType.Subcommand,
                } as Discord.APIApplicationCommandSubcommandOption)),
                handler: subcommandData,
            });
        }

        for (const commandFile of commandFiles) {
            const command = (await import(toFileString(join(commandsPath, categoryDir.name, commandFile.name)).toString())).default;
            commands.push(command);
        }
    }

    await api.applicationCommands.bulkOverwriteGlobalCommands((await api.users.getCurrent()).id, convert(commands));
}