const assert = require('node:assert/strict');
const { test } = require('node:test');
const childProcess = require('node:child_process');

test('Cypress seed tasks accept only named fixtures without a shell', () => {
  const calls = [];
  const original = childProcess.execFileSync;
  childProcess.execFileSync = (...args) => calls.push(args);
  try {
    const config = require('../../cypress.config.js');
    const events = {};
    const resolved = config.e2e.setupNodeEvents((name, value) => {
      events[name] = value;
    }, {});
    assert.equal(resolved.expose.API_LOCATION, 'http://localhost:3000');
    const modes = [
      ['default', ['run', 'seed']],
      ['certified', ['run', 'seed:certified-user']],
      ['donor', ['run', 'seed', '--', '--donor']],
      ['top-contributor', ['run', 'seed', '--', '--top-contributor']],
      ['unset-privacy-terms', ['run', 'seed', '--', '--unset-privacy-terms']]
    ];
    for (const [mode, args] of modes) {
      assert.equal(events.task.seed(mode), null);
      assert.deepEqual(calls.at(-1), ['npm', args, { timeout: 60000 }]);
    }
    for (const input of ['seed; arbitrary-command', '--help', {}, null]) {
      assert.throws(() => events.task.seed(input), /Unknown database fixture/);
    }
    assert.equal(calls.length, modes.length);
  } finally {
    childProcess.execFileSync = original;
  }
});
