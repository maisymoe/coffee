import { ChatInputCommandInteraction, Client, ClientOptions, ApplicationCommandOptionData, EmbedFooterOptions, ColorResolvable, EmbedField, ActivityType } from "discord.js";

export interface CommandOptions {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    su?: boolean;
    ephemeral?: boolean;
    handler: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class Command {
    public name: string;
    public description: string;
    public options?: ApplicationCommandOptionData[];
    public su?: boolean;
    public ephemeral?: boolean = false;
    public handler: (interaction: ChatInputCommandInteraction) => Promise<void>;

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
    channels: {
        log: string;
    }
    activity: {
        name: string;
        // type: ActivityType;
    };
}

export interface GenericEmbedOptions {
    title?: string;
    description?: string;
    fields?: EmbedField[];
    footer?: EmbedFooterOptions;
    color: ColorResolvable;
}

export interface ErrorEmbedOptions {
    title?: string;
    description?: string;
    fields?: EmbedField[];
}

export interface CoffeeClientOptions extends ClientOptions {
    config: Config;
    
    // TODO: Type the package.json?
    package: any;
}

export class CoffeeClient extends Client {
    config: Config;
    package: any;

    public constructor(options: CoffeeClientOptions) {
        super(options);

        this.config = options.config;
        this.package = options.package;
    };
}