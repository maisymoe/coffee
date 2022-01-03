import { client } from "..";

export async function configCheck() {
    const config = client.dynamicData.config.data;
    const missingFields = [];

    if (!config.servers || config.servers.length === 0) {
        missingFields.push("servers");
    }

    if (!config.users || config.users.length === 0) {
        missingFields.push("users");
    }

    if (missingFields.length > 0) {
        throw new Error(
            `You are missing the following required config fields: ${missingFields.join(", ")}`,
        );
    }
}

export async function reportError(message: string, error: Error) {
    console.log(message, error);
    for (const id of client.dynamicData.config.data.users!) {
        await (
            await client.users.fetch(id)
        ).send({
            content: `${message}\n\`\`\`js\n${error.stack ? error.stack : error.toString()}\`\`\``,
        });
    }
}
