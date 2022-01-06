import { Guild } from "discord.js";
import { CoffeeBot } from "."
import { DynamicData } from "./dynamic-data";
import { GuildIndex } from "./lib/def";

abstract class SettingProvider {
    public client: CoffeeBot;

    private listenerStatusChange: (guild: Guild | string, value: string) => void;

    public constructor(client: CoffeeBot) {
        this.client = client;
        this.listenerStatusChange = (guild: Guild | string, value: string): void => {
            this.set(guild, 'prefix', value);
        }
    }

    public async init(client: CoffeeBot): Promise<void> {
        this.client = client;
        client.on('statusChange', this.listenerStatusChange)
    }

    public async destroy(): Promise<void> {
        this.client.removeListener('statusChange', this.listenerStatusChange);
    }

    public get(_guild: Guild | string, _key: string, _defaultValue: any) {
        throw new Error(`This provider has no get method.`)
    }

    public set(_guild: Guild | string, _key: string, _value: any) {
        throw new Error(`This provider has no set method.`)
    }

    public remove(_guild: Guild | string, _key: string) {
        throw new Error(`This provider has no remove method.`)
    }

    public clear(_guild: Guild | string) {
        throw new Error(`This provider has no clear method.`)
    }

    static getGuildID(guild: Guild | string) {
        if (guild instanceof Guild) return guild.id;
        if (guild === 'global' || guild === null) return 'global';
        if (typeof guild === 'string') return guild;
        throw new TypeError('Invalid guild specified. Must be a Guild instance, guild ID, "global", or null.')
    }

}

export default class CoffeeSettingProvider extends SettingProvider {
    public client: CoffeeBot;
    public readonly data: DynamicData<GuildIndex>;

    public constructor(client: CoffeeBot, data: DynamicData<GuildIndex>) {
        super(client);
        this.client = client;
        this.data = data;
    }

    public async init(client: CoffeeBot): Promise<void> {
        await this.data.initialLoad;
        await super.init(client);
    }

    public async destroy(): Promise<void> {
        await super.destroy();
    }

    public get(guild: Guild | string, key: string, defaultValue?: any): any {
        const id: string = SettingProvider.getGuildID(guild);
        const guildObj = this.data.data[id];
        if (!guildObj) return defaultValue;
        if (!(key in guildObj)) return defaultValue;
        return guildObj[key];
    }

    public async set(guild: Guild | string, key: string, value: any): Promise<any> {
        const id: string = SettingProvider.getGuildID(guild);
        await this.data.modify((data: GuildIndex) => {
            data[id] = data[id] || {};
            data[id][key] = value;
        });
        return value;
    }

    public async remove(guild: Guild | string, key: string): Promise<any> {
        const value = this.get(guild, key);
        const id: string = SettingProvider.getGuildID(guild);
        await this.data.modify((data: GuildIndex) => {
            if (data[id]) delete data[id][key];
        });
        return value;
    }

    public clear(guild: Guild | string): Promise<void> {
        const id: string = SettingProvider.getGuildID(guild);
        return this.data.modify((data: GuildIndex) => {
            delete data[id];
        })
    }
}
