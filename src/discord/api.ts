import { Client, REST } from "discord.js";
import { Context, Effect, Layer } from "effect";
import { DiscordConfig } from "./config";

export type DiscordApi = Readonly<{
  rest: REST;
  client: Client;
}>;

const make = Effect.gen(function* () {
  const config = yield* DiscordConfig;
  const rest = new REST({ version: config.version }).setToken(config.token);
  const client = new Client({ intents: config.intents });

  return { rest, client };
});

export class DiscordApiClient extends Context.Tag("DiscordApi")<
  DiscordApiClient,
  DiscordApi
>() {
  static Live = Layer.effect(this, make);
}
