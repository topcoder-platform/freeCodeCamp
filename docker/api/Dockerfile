FROM node:26.12.1-bookworm AS builder
# Install doppler CLI
RUN (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh) | sh -s -- --verify-signature
# node images create a non-root user that we can use
USER node
WORKDIR /home/node/build
COPY --chown=node:node . .
# Pass `DOPPLER_TOKEN` at build time to create an encrypted snapshot for high-availability
ARG DOPPLER_TOKEN
RUN \
  doppler secrets download doppler.encrypted.json &&\
  npm ci --no-progress --ignore-scripts --legacy-peer-deps &&\
  node tools/legacy-compat/apply.cjs &&\
  doppler run --fallback=doppler.encrypted.json --command="npm run create:config" &&\
  doppler run --fallback=doppler.encrypted.json --command="npm run build:curriculum" &&\
  doppler run --fallback=doppler.encrypted.json --command="npm run build:server"

FROM node:26.12.1-alpine3.24 AS dependencies
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
COPY api-server/package.json api-server/package.json
COPY tools/minimatch-compat tools/minimatch-compat
COPY tools/legacy-compat tools/legacy-compat
COPY tools/disabled-direct-mail tools/disabled-direct-mail
RUN npm ci --omit=dev --workspace=api-server --include-workspace-root=false --ignore-scripts --legacy-peer-deps \
    && node tools/legacy-compat/apply.cjs \
    && mkdir -p api-server/node_modules

FROM alpine:3.24
RUN apk upgrade --no-cache && apk add --no-cache 'nodejs-current~26' ca-certificates \
    && addgroup -S -g 10001 app && adduser -S -D -u 10001 -G app app
ENV NODE_ENV=production PM2_HOME=/tmp/pm2
WORKDIR /app
COPY --from=builder --chown=app:app /home/node/build/api-server/lib/ api-server/lib/
COPY --from=builder --chown=app:app /home/node/build/utils/ utils/
COPY --from=builder --chown=app:app /home/node/build/config/ config/
COPY --from=dependencies --chown=app:app /app/api-server/node_modules/ api-server/node_modules/
COPY --from=dependencies --chown=app:app /app/node_modules/ node_modules/
WORKDIR /app/api-server
USER app
CMD ["node", "../node_modules/pm2/bin/pm2-runtime", "./lib/production-start.js"]
