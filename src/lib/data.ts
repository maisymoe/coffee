import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { proxy, subscribe } from "valtio/vanilla";

export function setupDataLink(file: string) {
    const dataFile = join(__dirname, "../", "../", "data", `${file}.json`);
    let parsedData;

    try {
        parsedData = JSON.parse(readFileSync(dataFile, "utf8"));
    } catch (e) {
        throw new Error(`Could not read/parse data file at ${dataFile}`);
    }

    const config = proxy(parsedData);
    subscribe(config, () => {
        try {
            writeFileSync(dataFile, JSON.stringify(config, null, 4));
        } catch (e) {
            throw new Error(`Could not write data file at ${dataFile}`);
        }
    });

    return config;
}