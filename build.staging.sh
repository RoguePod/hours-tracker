export RELEASE_VERSION=$(sentry-cli releases propose-version)

echo $RELEASE_VERSION

envsubst < ".env.staging.tmp" > ".env.staging"
