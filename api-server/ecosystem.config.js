module.exports = {
  apps: [{
    script: './lib/production-start.js',
    max_memory_restart: '600M',
    instances: process.env.WEB_CONCURRENCY || 'max',
    exec_mode: 'cluster',
    name: process.env.DEPLOYMENT_ENV === 'staging' ? 'dev' : 'org'
  }]
};
