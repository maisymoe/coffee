import {
    ActivityType,
    ApplicationCommandOptionData,
    Client,
    ClientOptions,
    CommandInteraction,
} from "discord.js";
import config from "../../data/config.json";
import auth from "../../data/auth.json";

export class CoffeeBot extends Client {
    public config: Config;
    public auth: AuthConfig;

    public constructor(options: ClientOptions) {
        super(options);

        this.config = config;
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
