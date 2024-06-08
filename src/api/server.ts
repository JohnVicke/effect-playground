import { HttpServer } from "@effect/platform";
import { BunHttpServer } from "@effect/platform-bun";
import { Effect, Layer } from "effect";

const router = HttpServer.router.empty.pipe(
  HttpServer.router.get("/health", HttpServer.response.text("OK")),
);

const App = router.pipe(
  Effect.annotateLogs({ module: "api-server" }),
  HttpServer.server.serve(HttpServer.middleware.logger),
  HttpServer.server.withLogAddress,
);

const port = 42069;

const Server = BunHttpServer.server.layer({ port });

export const ApiServer = Layer.provide(App, Server);
