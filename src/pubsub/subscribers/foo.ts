import { Effect, Queue, Layer } from "effect";
import { PubSubClient } from "../client";

const make = Effect.gen(function* () {
  yield* Effect.logInfo("Starting FooSubscriber");
  const pubsub = yield* PubSubClient;

  const subscriber = yield* pubsub.subscribeTo("Foo");

  yield* Effect.forkScoped(
    Effect.forever(
      Effect.gen(function* () {
        const { value } = yield* Queue.take(subscriber);
        yield* Effect.logInfo(value);
      }),
    ),
  ).pipe(Effect.catchAllDefect(() => Effect.logInfo("Stopped FooSubscriber")));
}).pipe(Effect.annotateLogs({ module: "foo-subscriber" }));

export const FooSubscriber = Layer.scopedDiscard(make).pipe(
  Layer.provide(PubSubClient.Live),
);
