import { BunRuntime } from "@effect/platform-bun";
import { Layer } from "effect";
import { ApiServer } from "./api/server";
import { PubSubSubscribers } from "./pubsub/subscribers";
import { DiscordService } from "./discord/service";

const BunTime = {
  funTime: BunRuntime.runMain,
};

const Main = Layer.mergeAll(ApiServer, PubSubSubscribers, DiscordService);

BunTime.funTime(Layer.launch(Main));
