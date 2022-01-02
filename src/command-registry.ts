import {Collection} from "discord.js"
import {CoffeeBot} from "./"
import { Command } from "./lib/def";

export class CommandRegistry {
    public client!: CoffeeBot;
    public commands: Array<Command>;

    constructor(client: CoffeeBot) {
        this.client = client;

        this.commands = new Array<Command>();
    }

    public registerCommand(command: Command): CommandRegistry {
        if (!(command instanceof Command)) throw new Error(`Invalid command object to register: ${command}`)

        if (this.commands.some(cmd => cmd.name === command.name)) {
            throw new Error(`A command with the name "${command.name}" is already registered.`)
        }

        this.commands.push(command);

        return this;
    }
}
