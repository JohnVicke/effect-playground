import { Collection, Routes, SlashCommandBuilder } from "discord.js";
import { pingCommand } from "./ping";
import { Cause, Effect, Layer } from "effect";
import { DiscordConfig } from "../config";
import { DiscordApiClient } from "../api";

class DiscordJSRefreshError {
  readonly _tag = "DiscordJSRefreshError";
}

export const getCommands = Effect.sync(() => {
  const discordCommands = new Collection<string, SlashCommandBuilder>();
  discordCommands.set(pingCommand.cmd.name, pingCommand.cmd);
  return discordCommands;
});

const make = Effect.gen(function* () {
  yield* Effect.logInfo("DiscordCommandRefresher starting...");
  const config = yield* DiscordConfig;
  const api = yield* DiscordApiClient;
  const commands = yield* getCommands;

  yield* Effect.tryPromise({
    try: () =>
      api.rest.put(Routes.applicationCommands(config.clientId), {
        body: commands.map((cmd) => cmd.toJSON()),
      }) as Promise<CommandResponse>,
    catch: () => new DiscordJSRefreshError(),
  }).pipe((res) =>
    Effect.match(res, {
      onFailure: function* (cause) {
        yield* Effect.logError("Failed to refresh commands", Cause.die(cause));
      },
      onSuccess: function* (res) {
        yield* Effect.forEach(res, (cmd) =>
          Effect.logInfo(`Refreshed: ${cmd.name}`),
        );
      },
    }),
  );
});

export const DiscordCommandRefresher = {
  Live: Layer.scopedDiscard(make).pipe(Layer.provide(DiscordApiClient.Live)),
};

type CommandResponse = Array<{
  id: string;
  application_id: string;
  version: string;
  default_member_permisiions: null | unknown;
  type: number;
  name: string;
  name_localizations: null | unknown;
  description: string;
  desription_localizations: null | unknown;
  dm_permissions: boolean;
  contexts: null | unknown;
  integrationTypes: Array<unknown | number>;
  nsfw: boolean;
}>;
