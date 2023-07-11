import { DJS } from "../deps.ts";
import { Intents } from "./gateway.ts";

export interface CoffeeClientOptions {
    intents: Intents[];
    token: string;
}

export class CoffeeClient extends DJS.Client {
    public options: CoffeeClientOptions;
    // This isn't accessible on the real client. Violence.
    private _ws: typeof DJS.WebSocketManager.prototype;

    public constructor(options: CoffeeClientOptions) {
        const rest = new DJS.REST({ version: "10" }).setToken(options.token);
        const ws = new DJS.WebSocketManager({
            rest,
            token: options.token,
            // TODO: Bad, bad, this is so bad!
            intents: eval(options.intents.join("|")),
        });

        super({ rest, gateway: ws });
        this._ws = ws;
        this.options = options;
    }

    login = () => this._ws.connect();
}