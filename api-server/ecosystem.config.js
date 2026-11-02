const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');

const filePath = path.resolve('..', '.env');
const env = fs.existsSync(filePath)
  ? dotenv.parse(fs.readFileSync(filePath))
  : {};

module.exports = {
  apps: [
    {
      script: `./lib/production-start.js`,
      env,
      max_memory_restart: '600M',
      instances: process.env.WEB_CONCURRENCY || 'max',
      exec_mode: 'cluster',
      name: env.DEPLOYMENT_ENV === 'staging' ? 'dev' : 'org'
    }
  ]
};
