import { Book } from "./common";

declare global {
  interface Window {
    SENTRY_ENVIRONMENT: string;
    SENTRY_RELEASE: string;
    initialBooks: Record<string, Book>;
  }
}
