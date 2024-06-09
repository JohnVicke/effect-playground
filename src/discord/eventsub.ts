import { Effect, Layer } from "effect";
import { DiscordApiClient } from "./api";
import { Events } from "discord.js";

const make = Effect.gen(function* () {
  yield* Effect.logInfo("Starting DiscordEventSub");
  const discord = yield* DiscordApiClient;

  discord.client.on(Events.ClientReady, function* () {
    yield* Effect.logInfo("DiscordEventSub client ready");
  });

  discord.client.on(Events.InteractionCreate, function* (interaction) {
    yield* Effect.logInfo(interaction);
  });
}).pipe(Effect.annotateLogs({ module: "discord-event-sub" }));

export const DiscordEventSub = {
  Live: Layer.scopedDiscard(make).pipe(Layer.provide(DiscordApiClient.Live)),
};
