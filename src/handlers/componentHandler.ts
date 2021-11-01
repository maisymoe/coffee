import { Collection } from "discord.js";
import path from "path";
import fs from "fs";

import { Button, SelectMenu } from "../lib/def";

export const buttons = new Collection<string, Button>();
export const selects = new Collection<string, SelectMenu>();

export default async function init() {
    const before = Date.now();

    async function registerButtons() {
        const buttonFolder = path.join(
            __dirname,
            "../",
            "components/",
            "buttons/"
        );
        const buttonFolders = fs.readdirSync(buttonFolder);

        for (const folder of buttonFolders) {
            const buttonFiles = fs
                .readdirSync(path.join(buttonFolder, folder))
                .filter((file) => file.endsWith(".js"));

            for (const file of buttonFiles) {
                const component = (
                    await import(path.join(buttonFolder, folder, file))
                ).default as Button;
                buttons.set(component.id, component);
            }
        }
    }

    async function registerSelects() {
        const selectFolder = path.join(
            __dirname,
            "../",
            "components/",
            "selects/"
        );
        const selectFolders = fs.readdirSync(selectFolder);

        for (const folder of selectFolders) {
            const selectFiles = fs
                .readdirSync(path.join(selectFolder, folder))
                .filter((file) => file.endsWith(".js"));

            for (const file of selectFiles) {
                const component = (
                    await import(path.join(selectFolder, folder, file))
                ).default as SelectMenu;
                selects.set(component.id, component);
            }
        }
    }

    registerButtons();
    registerSelects();

    console.log(
        `Component handler initialised. Took ${Date.now() - before}ms.`
    );
}
