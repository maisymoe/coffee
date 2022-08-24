import { ChatInputCommandInteraction, Client, ClientOptions, ApplicationCommandOptionData, EmbedFooterOptions, ColorResolvable, EmbedField, ActivityType, Guild, User, TextChannel, TextBasedChannel } from "discord.js";
import { PackageJson } from "type-fest";
import { libBasic, Value, VM } from "cumlisp";
import { installCoffee } from "./lib/lisp/libCoffee";
import { installDiscord } from "./lib/lisp/libDiscord";

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
    blacklist: string[];
    users: string[];
    guild: string;
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

export interface Constants {
    users: User[];
    guild: Guild;
    channels: {
        log: TextChannel;
    }
    activity: {
        name: string;
        type: number;
    }
}

export type Indexable = {
    [index: string]: any;
}

export type IndexablePackageJson = PackageJson & Indexable;

export interface DiscordVMContext {
    client: CoffeeClient;
    interaction: ChatInputCommandInteraction;
    channel: TextBasedChannel;
    author: User;
    args: Value[];
}

export class CoffeeVM extends VM {
    public readonly context: DiscordVMContext;
    public constructor(context: DiscordVMContext) {
        super();
        this.context = context;
        libBasic.installBasic(this);
        installCoffee(this, context);
        installDiscord(this, context);
    }
}

export interface CoffeeClientOptions extends ClientOptions {
    config: Config;
    constants?: Constants
    package: IndexablePackageJson;
    gitInfo?: GitInfo;
    insults?: string[];
}

export class CoffeeClient extends Client {
    config: Config;
    constants?: Constants;
    package: IndexablePackageJson;
    gitInfo?: GitInfo;
    insults?: string[];

    public constructor(options: CoffeeClientOptions) {
        super(options);

        this.config = options.config;
        this.constants = options.constants;
        this.package = options.package;
        this.insults = options.insults || [];
        this.gitInfo = options.gitInfo || {
            branch: "unknown",
            commit: "unknown",
        };
    };
}