import { GatewayIntentBits } from "discord.js";
import { Config } from "effect";

export const DiscordConfig = Config.all({
  clientId: Config.string("DISCORD_CLIENT_ID"),
  clientSecret: Config.string("DISCORD_CLIENT_SECRET"),
  token: Config.string("DISCORD_TOKEN"),
}).pipe(
  Config.map((env) => ({
    ...env,
    version: "10",
    intents: [GatewayIntentBits.Guilds],
  })),
);
