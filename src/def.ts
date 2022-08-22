import { ChatInputCommandInteraction, Client, ClientOptions, ApplicationCommandOptionData, EmbedFooterOptions, ColorResolvable, EmbedField, ActivityType } from "discord.js";
import { PackageJson } from "type-fest";

export interface CommandOptions {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    su?: boolean;
    noAck?: boolean;
    ephemeral?: boolean;
    handler: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export class Command {
    public name: string;
    public description: string;
    public options?: ApplicationCommandOptionData[];
    public su?: boolean;
    public noAck?: boolean = false;
    public ephemeral?: boolean = false;
    public handler: (interaction: ChatInputCommandInteraction) => Promise<void>;

    public constructor(co: CommandOptions) {
        this.name = co.name;
        this.description = co.description;
        this.options = co.options;
        this.su = co.su;
        this.noAck = co.noAck;
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
        type: ActivityTypeResolvable;
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
    footer?: EmbedFooterOptions;
}

export type ActivityTypeResolvable = ActivityType | string;

export interface GitInfo {
    branch: string;
    commit: string;
}

export interface CoffeeClientOptions extends ClientOptions {
    config: Config;
    package: PackageJson;
    gitInfo?: GitInfo;
    insults?: string[];
}

export class CoffeeClient extends Client {
    config: Config;
    package: PackageJson;
    gitInfo: GitInfo;
    insults: string[];

    public constructor(options: CoffeeClientOptions) {
        super(options);

        this.config = options.config;
        this.package = options.package;
        this.insults = options.insults || [];
        this.gitInfo = options.gitInfo || {
            branch: "unknown",
            commit: "unknown",
        };
    };
}