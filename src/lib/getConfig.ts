import { readFileSync } from "fs";
import { join } from "path";

export default function getConfig() {
    const configFile = join(__dirname, "../", "../", "data", "config.json");

    try {
        return JSON.parse(readFileSync(configFile, "utf8"));
    } catch (e) {
        throw new Error(`Could not read/parse config file at ${configFile}`);
    }
}