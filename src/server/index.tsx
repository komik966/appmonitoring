import { RequestListener, createServer } from "http";
import { readFileSync } from "fs";
import process from "process";
import { renderToString } from "react-dom/server";
import { App } from "../common";
import React from "react";
import { createClient } from "redis";
import * as Sentry from "@sentry/node";
import "@sentry/tracing";
import { RewriteFrames } from "@sentry/integrations";

const env = {
  scheme: "http",
  host: "localhost",
  port: 8080,
  name: "dev",
  release: process.env.SENTRY_RELEASE || "0.0.0",
  rewriteFramesRoot:
    "/Users/konradmikucki/projects/sandbox/appmonitoring/dist/server",
};

Sentry.init({
  dsn: "http://ea891f87c434400cba10905cb4c6a398@localhost:9000/6",
  environment: env.name,
  release: env.release,
  integrations: [new RewriteFrames({ root: env.rewriteFramesRoot })],
});

(async () => {
  const redisClient = createClient();
  await redisClient.connect();
  const assets = {
    index: readFileSync("dist/client/index.js"),
  };

  const rootHandler: RequestListener = (req, res) => {
    const url = new URL(`${env.scheme}://${env.host}:${env.port}${req.url}`);
    const handler = handlers[url.pathname];

    if (!handler) {
      res.writeHead(404, { "content-type": "text/html" });
      res.end("Not found");
      return;
    }

    handler(req, res);
  };
  const handlers: { [path: string]: RequestListener } = {
    "/": async (req, res) => {
      const booksList = await redisClient.lRange("books", 0, -1);
      const initialBooks = booksList.reduce(
        (prev, curr, idx) => ({ ...prev, [idx]: JSON.parse(curr) }),
        {}
      );
      res.writeHead(200, { "content-type": "text/html" });
      res.end(`
                <html lang="en">
                    <body>
                        <style>body { margin: 0 }</style>
                        <div id="root">${renderToString(
                          <App books={initialBooks} />
                        )}</div>
                        <script>
                          window.SENTRY_ENVIRONMENT = '${env.name}'
                          window.SENTRY_RELEASE = '${env.release}'
                          window.initialBooks = ${JSON.stringify(initialBooks)}
                        </script>
                        <script src="/index.js"></script>
                    </body>
                </html>
            `);
    },
    "/index.js": (req, res) => {
      res.writeHead(200, { "content-type": "application/javascript" });
      res.end(assets.index);
    },
  };

  createServer(rootHandler).listen(env.port);
})();
