const assert = require('node:assert/strict');
const { test } = require('node:test');
const { mkdtemp, writeFile, rm } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const http = require('node:http');
const fileType = require('../file-type-compat/index.cjs');
const proxyAgent = require('../proxy-agent-compat/index.cjs');
const decode = require('../decode-uri-component-compat/index.cjs');

test('Gatsby file detection works through the legacy async methods', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'fcc-file-type-'));
  try {
    const png = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=',
      'base64'
    );
    const file = path.join(dir, 'image.png');
    await writeFile(file, png);
    assert.deepEqual(await fileType.fromBuffer(png), {
      ext: 'png',
      mime: 'image/png'
    });
    assert.deepEqual(await fileType.fromFile(file), {
      ext: 'png',
      mime: 'image/png'
    });
    assert.equal(
      await fileType.fromBuffer(Buffer.from('plain text')),
      undefined
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('the legacy proxy constructor routes a request through the selected proxy', async () => {
  let requested;
  const proxy = http.createServer((req, res) => {
    requested = req.url;
    res.end('proxied');
  });
  await new Promise(resolve => proxy.listen(0, '127.0.0.1', resolve));
  const agent = proxyAgent(`http://127.0.0.1:${proxy.address().port}`);
  try {
    const body = await new Promise((resolve, reject) => {
      http
        .get('http://example.invalid/image.png', { agent }, res => {
          let data = '';
          res.setEncoding('utf8');
          res.on('data', chunk => {
            data += chunk;
          });
          res.on('end', () => resolve(data));
        })
        .on('error', reject);
    });
    assert.equal(requested, 'http://example.invalid/image.png');
    assert.equal(body, 'proxied');
    assert.throws(() => proxyAgent({}), TypeError);
  } finally {
    agent.destroy();
    await new Promise(resolve => proxy.close(resolve));
  }
});

test('the decoder retains malformed input handling and decodes UTF-8', () => {
  assert.equal(decode('hello%20world%F0%9F%98%80'), 'hello world😀');
  assert.equal(decode('%not-a-code'), '%not-a-code');
  assert.equal(typeof decode('%E0%A4%A'), 'string');
});
