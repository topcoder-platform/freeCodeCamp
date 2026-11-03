#!/bin/sh
set -eu
node /app/deploy/write-public-config.cjs
exec node ../node_modules/pm2/bin/pm2-runtime ./ecosystem.config.js
