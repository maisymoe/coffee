import { CoffeeBot } from "./";
import { Command } from "./lib/def";
import JSONCommand from "./commands/system/json";

export class CommandRegistry {
    public client: CoffeeBot;
    public commands: Array<Command>;
    private activeJSONCommands: Array<Command>;

    constructor(client: CoffeeBot) {
        this.client = client;

        this.commands = new Array<Command>();
        this.activeJSONCommands = new Array<Command>();

        this.client.dynamicData.jsonCommands.onModify(() => {
            this.client.registry.reloadJSONCommands();
        });
    }

    public registerCommand(command: Command): CommandRegistry {
        if (!(command instanceof Command))
            throw new Error(`Invalid command object to register: ${command}`);

        if (this.commands.some((cmd) => cmd.name === command.name)) {
            throw new Error(`A command with the name "${command.name}" is already registered.`);
        }

        this.commands.push(command);

        return this;
    }

    public unregisterCommand(command: Command) {
        this.commands.splice(this.commands.indexOf(command), 1);
    }

    public reloadJSONCommands() {
        if (this.activeJSONCommands.length > 0) {
            for (const command of this.activeJSONCommands) {
                this.client.registry.unregisterCommand(command);
            }

            this.activeJSONCommands = new Array<Command>();
        }

        const jsonCommands = this.client.dynamicData.jsonCommands.data;
        for (const g in jsonCommands) {
            // Maybe construct an instance of a Help command here and push that to
            // the command registry
            // also, if we actually implement categories, we can push `g` to that
            // array

            for (const c in jsonCommands[g]) {
                const command = new JSONCommand(this.client, g, c, jsonCommands[g][c]);
                this.client.registry.registerCommand(command);
                this.activeJSONCommands.push(command);
            }
        }
    }
}
