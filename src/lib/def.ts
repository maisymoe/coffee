import {
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

    users: string[];

    activity: {
        name: string;
        type: string;
    };
}

export interface AuthConfig {
    token: string;
    clientId: string;
    publicKey: string;
}

export interface CommandOptions {
    name: string;
    description?: string;
    ephemeral?: true;
    args?: string[];
    devOnly?: true;
    su?: true;
    callback: (interaction: CommandInteraction) => any;
}

export class Command {
    public name: string;
    public description: string;
    public ephemeral: boolean;
    public devOnly: boolean;
    public su: boolean;
    public callback: (interaction: CommandInteraction) => any;

    public constructor(options: CommandOptions) {
        this.name = options.name;
        this.description = options.description || "No description.";
        this.ephemeral = options.ephemeral || false;
        this.devOnly = options.devOnly || false;
        this.su = options.su || false;
        this.callback = options.callback;
    }
}
