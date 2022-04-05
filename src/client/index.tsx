import React from "react";
import { hydrateRoot } from "react-dom/client";
import { App } from "../common";
import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "http://81bfabc06c584435b8d7d6373f1e6a38@localhost:9000/7",
  environment: window.SENTRY_ENVIRONMENT,
  release: window.SENTRY_RELEASE,
  integrations: [new BrowserTracing()],
});

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("root");
  if (root) {
    hydrateRoot(root, <App books={window.initialBooks} />);
  }
});
