import { Config, Server } from "../lib/def";
import meta from "../../package.json";

export default new Config({
    servers: [
        new Server({
            id: "829798084207706152",
            alias: "molten",
        }),
        new Server({
            id: "824921608560181258",
            alias: "cumcord",
        }),
    ],
    users: ["257109471589957632", "465702500146610176"],
    activity: {
        name: `being coffee. | ${meta.version}`,
        type: "COMPETING"
    },
});