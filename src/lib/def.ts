import {
    ApplicationCommandOptionData,
    ApplicationCommandType,
    ActivityOptions,
    CommandInteraction,
    MessageEmbedOptions,
} from "discord.js";
import { CoffeeBot } from "../";

export interface CommandOptions {
    name: string;
    description?: string;
    category: string;
    options?: ApplicationCommandOptionData[];
    type?: ApplicationCommandType | "CHAT_INPUT";
    servers?: string[];
    ephemeral?: true;
    su?: true;
}

export abstract class Command {
    public client: CoffeeBot;
    public name: string;
    public description?: string;
    public category: string;
    public options?: ApplicationCommandOptionData[];
    public type?: ApplicationCommandType | "CHAT_INPUT";
    public servers?: string[];
    public ephemeral?: true;
    public su?: true;

    public constructor(client: CoffeeBot, commandOptions: CommandOptions) {
        this.client = client;
        this.name = commandOptions.name;
        this.description = commandOptions.description;
        this.category = commandOptions.category;
        this.options = commandOptions.options;
        this.type = commandOptions.type;
        this.servers = commandOptions.servers;
        this.ephemeral = commandOptions.ephemeral;
        this.su = commandOptions.su;
    }

    async execute(_interaction: CommandInteraction): Promise<any> {
        throw new Error(`${this.constructor.name} doesn't have a run() method.`);
    }
}

// JSON Commands {{{
export interface JSONCommand {
    description?: string;
    format?: string;
    embed?: MessageEmbedOptions;
}
export interface CommandGroup {
    [command: string]: JSONCommand;
}
export interface CommandSet {
    [category: string]: CommandGroup;
}
// }}}

// Config {{{
export interface Server {
    id: string;
    alias: string;
}

export interface Config {
    servers?: Server[];
    users?: string[];
    activity?: ActivityOptions;
}
/// }}}
