import { Effect, Layer } from "effect";
import { PubSubClient } from "../pubsub/client";
import { DiscordApiClient } from "./api";
import { DiscordEventSub } from "./eventsub";
import { DiscordCommandRefresher } from "./commands";

const make = Effect.gen(function* () {
  yield* Effect.logInfo("DiscordService starting...");
  yield* Effect.acquireRelease(Effect.logInfo("DiscordService started"), () =>
    Effect.logInfo("DiscordService stopped"),
  );
}).pipe(Effect.annotateLogs({ module: "discord-service" }));

export const DiscordService = Layer.scopedDiscard(make).pipe(
  Layer.provide(DiscordApiClient.Live),
  Layer.provide(PubSubClient.Live),
  Layer.provide(DiscordEventSub.Live),
  Layer.provide(DiscordCommandRefresher.Live),
);
