import * as Sentry from "@sentry/browser";

if (process.env.ENV !== "development") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: "3a40af93a3b8ade58de78433614ec651e04f47bb"
  });
}
