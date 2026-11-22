const { execFileSync } = require('child_process');
const { existsSync } = require('fs');
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8000',
    projectId: 'ke77ns',
    retries: 4,
    chromeWebSecurity: false,
    specPattern: 'cypress/e2e/**/*.js',
    setupNodeEvents(on, config) {
      config.expose = config.expose || {};
      on('before:run', () => {
        if (!existsSync('./config/curriculum.json')) {
          execFileSync('npm', ['run', 'build:curriculum']);
        }
      });

      on('task', {
        seed(mode = 'default') {
          const commands = new Map([
            ['default', ['run', 'seed']],
            ['certified', ['run', 'seed:certified-user']],
            ['donor', ['run', 'seed', '--', '--donor']],
            ['top-contributor', ['run', 'seed', '--', '--top-contributor']],
            [
              'unset-privacy-terms',
              ['run', 'seed', '--', '--unset-privacy-terms']
            ]
          ]);
          const args = commands.get(mode);
          if (!args) throw new Error('Unknown database fixture mode');
          execFileSync('npm', args, { timeout: 60000 });
          return null;
        }
      });
      config.expose.API_LOCATION = 'http://localhost:3000';
      return config;
    }
  }
});
