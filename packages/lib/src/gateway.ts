import { DJS } from "../deps.ts";

const GIB = DJS.GatewayIntentBits;
export enum Intents {
    GUILDS = GIB.Guilds,
    GUILD_MEMBERS = GIB.GuildMembers,
    GUILD_MODERATION = GIB.GuildModeration,
    GUILD_EMOJIS_AND_STICKERS = GIB.GuildEmojisAndStickers,
    GUILD_INTEGRATIONS = GIB.GuildIntegrations,
    GUILD_WEBHOOKS = GIB.GuildWebhooks,
    GUILD_INVITES = GIB.GuildInvites,
    GUILD_VOICE_STATES = GIB.GuildVoiceStates,
    GUILD_PRESENCES = GIB.GuildPresences,
    GUILD_MESSAGES = GIB.GuildMessages,
    GUILD_MESSAGE_REACTIONS = GIB.GuildMessageReactions,
    GUILD_MESSAGE_TYPING = GIB.GuildMessageTyping,
    DIRECT_MESSAGES = GIB.DirectMessages,
    DIRECT_MESSAGE_REACTIONS = GIB.DirectMessageReactions,
    DIRECT_MESSAGE_TYPING = GIB.DirectMessageTyping,
    MESSAGE_CONTENT = GIB.MessageContent,
    GUILD_SCHEDULED_EVENTS = GIB.GuildScheduledEvents,
    AUTO_MODERATION_CONFIGURATION = GIB.AutoModerationConfiguration,
    AUTO_MODERATION_EXECUTION = GIB.AutoModerationExecution,
}

// TODO: Fight with TypeScript in order to export our own SCREAMING_SNAKE_CASE events, because I prefer those.
// Currently making just another enum with the same values as the real one and attempting to use those does not work.
export const Events = DJS.GatewayDispatchEvents;