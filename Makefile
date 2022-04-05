SENTRY_RELEASE := $(shell node -p -e "require('./package.json').version")

start:
	SENTRY_RELEASE=$(SENTRY_RELEASE) node dist/server/server/index.js

release-all: clean compile release-server release-client

clean:
	rm -rf dist

compile:
	npx babel -s -x .ts,.tsx ./src/server -d dist/server/server
	npx babel -s -x .ts,.tsx ./src/common -d dist/server/common
	npx webpack --env production

watch:
	npx babel --watch -x .ts,.tsx ./src/server -d dist/server/server &
	npx babel --watch -x .ts,.tsx ./src/common -d dist/server/common &
	npx webpack --env development --watch

release-server:
	$(call release-sequence,playground-server,dist/server)

release-client:
	$(call release-sequence,playground-client,dist/client)

redis-fixtures:
	cat redis-fixtures.txt | docker run -i --rm --network appmonitoring_default redis redis-cli -h 172.21.0.2

define release-sequence
npx sentry-cli releases -p $(1) new $(SENTRY_RELEASE)
npx sentry-cli releases -p $(1) files $(SENTRY_RELEASE) upload-sourcemaps $(2)
npx sentry-cli releases -p $(1) finalize $(SENTRY_RELEASE)
endef

.PHONY: start release-all clean compile release-server release-client redis-fixtures
