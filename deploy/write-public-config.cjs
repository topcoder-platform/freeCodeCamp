// Generate only the public configuration JSON. Private credentials stay in the
// ECS-injected process environment and never enter an image or a config file.
const fs = require('node:fs');
const path = require('node:path');
const building = process.argv[2] === '--build';
if (building) {
  Object.assign(process.env, {
    HOME_LOCATION: 'https://build.example.test', API_LOCATION: 'https://api.example.test',
    FORUM_LOCATION: 'https://forum.example.test', NEWS_LOCATION: 'https://news.example.test',
    CLIENT_LOCALE: 'english', CURRICULUM_LOCALE: 'english',
    DEPLOYMENT_ENV: 'staging', FREECODECAMP_NODE_ENV: 'development'
  });
} else {
  const required = ['HOME_LOCATION', 'API_LOCATION', 'CLIENT_LOCALE', 'CURRICULUM_LOCALE',
    'DEPLOYMENT_ENV', 'SESSION_SECRET', 'COOKIE_SECRET', 'JWT_SECRET',
    'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'AUTH0_DOMAIN'];
  if (required.some(name => !process.env[name]) || !(process.env.MONGODB || process.env.MONGOHQ_URL)) {
    throw new Error('Missing ECS runtime configuration; values are not logged.');
  }
}
const publicConfig = require('../config/read-env');
fs.writeFileSync(path.join(__dirname, '../config/env.json'), JSON.stringify(publicConfig), { mode: 0o600 });
