import * as Sentry from "@sentry/browser";

if (process.env.ENV !== "development") {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    release: process.env.RELEASE_VERSION
  });

  /* eslint-disable */
  console.log(process.env.RELEASE_VERSION);
  /* eslint-enable */
}
