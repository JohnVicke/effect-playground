import { Client, REST, Routes } from "discord.js";
import { Context, Effect, Layer } from "effect";
import { DiscordConfig } from "./config";
import { getCommands } from "./commands";

export type DiscordApi = Readonly<{
  rest: REST;
  client: Client;
}>;

const make = Effect.gen(function* () {
  const config = yield* DiscordConfig;
  const rest = new REST({ version: config.version }).setToken(config.token);
  const client = new Client({ intents: config.intents });

  const result = yield* Effect.tryPromise({
    try: () =>
      rest.put(Routes.applicationCommands(config.clientId), {
        body: getCommands().map((cmd) => cmd.toJSON()),
      }),
    catch: (cause) => {
      Effect.logError(cause);
    },
  });

  return { rest, client };
});

export class DiscordApiClient extends Context.Tag("DiscordApi")<
  DiscordApiClient,
  DiscordApi
>() {
  static Live = Layer.effect(this, make);
}
