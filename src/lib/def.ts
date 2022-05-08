import {
    ActivityType,
    ApplicationCommandOptionData,
    Client,
    ClientOptions,
    CommandInteraction,
    ColorResolvable,
    TextBasedChannel,
    User,
} from "discord.js";
import { VM, libBasic, Value } from "cumlisp";

import config from "../../data/config.json";
import auth from "../../data/auth.json";

export class CoffeeBot extends Client {
    public config: Config;
    public auth: AuthConfig;

    public constructor(options: ClientOptions) {
        super(options);

        this.config = {
            ...config,
            cosmetics: {
                palette: {
                    accent: parseInt(config.cosmetics.palette.accent.replace("#", ""), 16),
                    error: parseInt(config.cosmetics.palette.error.replace("#", ""), 16),
                    warn: parseInt(config.cosmetics.palette.warn.replace("#", ""), 16),
                    success: parseInt(config.cosmetics.palette.success.replace("#", ""), 16),
                }
            }
        };
        this.auth = auth;
    }
}

export interface TestGuild {
    id: string;
    alias: string;
}

export interface Config {
    testGuilds: TestGuild[];

    logging: {
        errors: string;
    }

    users: string[];

    activity: {
        name: string;
        type: ActivityType | string;
    };

    cosmetics: {
        palette: {
            accent: ColorResolvable;
            error: ColorResolvable;
            warn: ColorResolvable;
            success: ColorResolvable;
        }
    }
}

export interface AuthConfig {
    token: string;
    clientId: string;
    publicKey: string;
}

export interface CommandOptions {
    name: string;
    description: string;
    options?: ApplicationCommandOptionData[];
    ephemeral?: boolean;
    ignoreAck?: boolean;
    devOnly?: boolean;
    su?: boolean;
    callback: (interaction: CommandInteraction) => any;
}

export class Command {
    public name: string;
    public description: string;
    public options?: ApplicationCommandOptionData[];
    public ephemeral?: boolean;
    public ignoreAck?: boolean;
    public devOnly?: boolean;
    public su?: boolean;
    public callback: (interaction: CommandInteraction) => any;

    public constructor(co: CommandOptions) {
        this.name = co.name;
        this.description = co.description;
        this.options = co.options;
        this.ephemeral = co.ephemeral;
        this.ignoreAck = co.ignoreAck;
        this.devOnly = co.devOnly;
        this.su = co.su;
        this.callback = co.callback;
    }
}

// cLISP VMContext suitable for use in slash commands
export interface DiscordVMContext {
    client: Client;
    interaction: CommandInteraction;
    channel: TextBasedChannel;
    author: User;
    args: Value[];
};

export class CoffeeVM extends VM {
    public readonly context?: DiscordVMContext;
    public constructor(context?: DiscordVMContext) {
        super();
        this.context = context;
        libBasic.installBasic(this);
    }
}