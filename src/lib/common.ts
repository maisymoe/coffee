import config from "../config";
import { client } from "..";

export async function reportError(message: string, error: Error) {
    console.log(message, error);
    for (const id of config.users) {
        await (await client.users.fetch(id)).send({ content: `${message}\n\`\`\`js\n${error.stack ? error.stack : error.toString()}\`\`\`` });
    }
}