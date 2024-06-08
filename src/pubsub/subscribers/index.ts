import { Effect, Layer } from "effect";
import { FooSubscriber } from "./foo";

const make = Effect.gen(function* () {
  yield* Effect.logInfo("PubSubSubscribers starting...");
  yield* Effect.acquireRelease(
    Effect.logInfo("PubSubSubscribers started"),
    () => Effect.logInfo("PubSubSubscribers stopped"),
  );
}).pipe(Effect.annotateLogs({ module: "pubsub-subscribers" }));

export const PubSubSubscribers = Layer.scopedDiscard(make).pipe(
  Layer.provide(FooSubscriber),
);
