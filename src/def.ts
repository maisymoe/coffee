import { CommandInteraction, Client, ClientOptions, ApplicationCommandOptionData } from "discord.js";
import { Nest } from "nests/types";

export interface CommandOptions {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    su?: boolean;
    ephemeral?: boolean;
    handler: (interaction: CommandInteraction) => Promise<void>;
}

export class Command {
    public name: string;
    public description: string;
    public options?: ApplicationCommandOptionData[];
    public su?: boolean;
    public ephemeral?: boolean = false;
    public handler: (interaction: CommandInteraction) => Promise<void>;

    public constructor(co: CommandOptions) {
        this.name = co.name;
        this.description = co.description;
        this.options = co.options;
        this.su = co.su;
        this.ephemeral = co.ephemeral;
        this.handler = co.handler;
    };
}

export interface Config {
    [index: string]: any;
    token: string;
    users: string[];
}

export interface CoffeeClientOptions extends ClientOptions {
    config: Nest<Config>;
}

export class CoffeeClient extends Client {
    config: Nest<Config>;

    public constructor(options: CoffeeClientOptions) {
        super(options);

        this.config = options.config;
    };
}