import { Context, Effect, Layer, PubSub, Queue, Scope } from "effect";
import {
  isMessageType,
  type Message,
  type MessageType,
  type MessageTypeToMessage,
} from "./messages";

export type PubSubService = Readonly<{
  publish: (message: Message) => Effect.Effect<boolean>;
  subscribe: () => Effect.Effect<Queue.Dequeue<Message>, never, Scope.Scope>;
  subscribeTo: <T extends MessageType>(
    messageType: T,
  ) => Effect.Effect<
    Queue.Dequeue<MessageTypeToMessage[T]>,
    never,
    Scope.Scope
  >;
}>;

const make = Effect.gen(function* () {
  yield* Effect.logInfo("Starting PubSub service");

  const pubsub: PubSub.PubSub<Message> = yield* Effect.acquireRelease(
    PubSub.unbounded<Message>().pipe(
      Effect.tap(Effect.logInfo("PubSub service started")),
    ),
    (q) =>
      PubSub.shutdown(q).pipe(
        Effect.tap(Effect.logInfo("PubSub service stopped")),
      ),
  );

  return PubSubClient.of({
    publish: (message) => PubSub.publish(pubsub, message),
    subscribe: () => PubSub.subscribe(pubsub),
    subscribeTo: <T extends MessageType>(messageType: T) =>
      Effect.gen(function* () {
        const queue = yield* Effect.acquireRelease(
          Queue.unbounded<MessageTypeToMessage[T]>(),
          (q) => Queue.shutdown(q),
        );

        const subscription = yield* PubSub.subscribe(pubsub);

        yield* Effect.forkScoped(
          Effect.forever(
            Effect.gen(function* () {
              const message = yield* subscription.take;
              if (isMessageType(message, messageType)) {
                yield* Queue.offer(queue, message);
              }
            }),
          ).pipe(Effect.catchAll(() => Effect.void)),
        );
        return queue;
      }),
  });
}).pipe(Effect.annotateLogs({ module: "pubsub-client" }));

export class PubSubClient extends Context.Tag("pubsub-client")<
  PubSubClient,
  PubSubService
>() {
  static Live = Layer.scoped(this, make);
}
