import { DJS, Discord } from "../../deps.ts";

type CommandCallback = (interaction: Discord.APIInteraction) => Promise<void>;

interface ICommand {
    name: string;
    description: string;
    callback: CommandCallback;
}

class Command implements ICommand {
    public name: string;
    public description: string;
    public callback: CommandCallback;

    constructor(options: ICommand) {
        this.name = options.name;
        this.description = options.description;
        this.callback = options.callback;
    }
}

// TODO: Probably export this elsewhere
export const commands = new Array<Command>;

export default async function setupCommandHandler(commandsPath: string, api: typeof DJS.API.prototype) {
    const categories = Deno.readDirSync(commandsPath);

    for (const category of categories) {
        // TODO
    }
}