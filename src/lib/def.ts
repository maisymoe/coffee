import {
    ApplicationCommandOptionData,
    ApplicationCommandType,
    ActivityOptions,
    Interaction,
    ButtonInteraction,
    SelectMenuInteraction,
} from "discord.js";

export interface AuthOptions {
    discord: {
        token: string;
        clientId: string;
        publicKey: string;
    };
}

export class Auth {
    public discord: {
        token: string;
        clientId: string;
        publicKey: string;
    };

    public constructor(authOptions: AuthOptions) {
        this.discord = authOptions.discord;
    }
}

export interface ConfigOptions {
    servers: string[];
    users: string[];
    activity: ActivityOptions;
}

export class Config {
    public servers: string[];
    public users: string[];
    public activity: ActivityOptions;

    public constructor(configOptions: ConfigOptions) {
        this.servers = configOptions.servers;
        this.users = configOptions.users;
        this.activity = configOptions.activity;
    }
}

export interface CommandOptions {
    name: string;
    description?: string;
    category: string;
    options?: ApplicationCommandOptionData[];
    type?: ApplicationCommandType;
    ephemeral?: boolean;
    execute(interaction: Interaction): any;
}

export class Command {
    public name: string;
    public description?: string;
    public category: string;
    public options?: ApplicationCommandOptionData[];
    public type?: ApplicationCommandType;
    public ephemeral?: boolean;

    public execute: (interaction: Interaction) => any;

    public constructor(commandOptions: CommandOptions) {
        this.name = commandOptions.name;
        this.description = commandOptions.description;
        this.category = commandOptions.category;
        this.options = commandOptions.options;
        this.type = commandOptions.type;
        this.ephemeral = commandOptions.ephemeral;
        this.execute = commandOptions.execute;
    }
}

export interface ButtonOptions {
    id: string;
    ephemeral?: boolean;
    execute: (interaction: ButtonInteraction) => any;
}

export class Button {
    public id: string;
    public ephemeral?: boolean;
    public execute: (interaction: ButtonInteraction) => any;

    public constructor(buttonOptions: ButtonOptions) {
        this.id = buttonOptions.id;
        this.ephemeral = buttonOptions.ephemeral;
        this.execute = buttonOptions.execute;
    }
}

export interface SelectMenuOptions {
    id: string;
    ephemeral?: boolean;
    execute: (interaction: SelectMenuInteraction) => any;
}

export class SelectMenu {
    public id: string;
    public ephemeral?: boolean;
    public execute: (interaction: SelectMenuInteraction) => any;

    public constructor(selectMenuOptions: SelectMenuOptions) {
        this.id = selectMenuOptions.id;
        this.ephemeral = selectMenuOptions.ephemeral;
        this.execute = selectMenuOptions.execute;
    }
}
