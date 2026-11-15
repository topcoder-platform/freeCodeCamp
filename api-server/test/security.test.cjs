const assert = require('node:assert/strict');
const { test } = require('node:test');
const { createRequire } = require('node:module');
const http = require('node:http');
const net = require('node:net');
const loopback = require('loopback');
const SecureMailConnector = require('../src/server/connectors/mail');

const listen = server =>
  new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const close = server => new Promise(resolve => server.close(resolve));
const send = (Email, options) =>
  new Promise((resolve, reject) =>
    Email.send(options, (err, info) => (err ? reject(err) : resolve(info)))
  );
const message = {
  from: 'sender@example.test',
  to: 'recipient@example.test',
  subject: 'Security regression',
  text: 'Plain content',
  html: '<b>HTML content</b>'
};
function mailModel(transport) {
  const ds = new loopback.DataSource({
    connector: SecureMailConnector,
    transport
  });
  const Email = loopback.Email.extend('SecurityEmail');
  Email.attachTo(ds);
  return { ds, Email };
}

test('LoopBack Email retains MIME content, AWS credentials and callback errors with SES v2', async () => {
  const { ds, Email } = mailModel({
    type: 'ses',
    alias: 'primary',
    region: 'ap-southeast-2',
    accessKeyId: 'fixture',
    secretAccessKey: 'fixture-secret',
    sessionToken: 'fixture-token'
  });
  const transport = ds.connector.defaultTransport().transporter;
  const client = transport.ses.sesClient;
  assert.equal(await client.config.region(), 'ap-southeast-2');
  assert.equal(
    (await client.config.credentials()).sessionToken,
    'fixture-token'
  );
  let command;
  client.send = async value => {
    command = value;
    return { MessageId: 'fixture-message' };
  };
  const info = await send(Email, { ...message, transport: 'primary' });
  assert.ok(info.messageId.includes('fixture-message'));
  assert.equal(command.constructor.name, 'SendEmailCommand');
  const mime = Buffer.from(command.input.Content.Raw.Data).toString();
  assert.ok(mime.includes('Plain content'));
  assert.ok(mime.includes('<b>HTML content</b>'));
  assert.ok(mime.includes('recipient@example.test'));
  client.send = async () => {
    throw new Error('SES fixture failure');
  };
  await assert.rejects(send(Email, message), /SES fixture failure/);
  client.destroy();
});

test('SMTP delivery still works through the LoopBack Email model', async () => {
  let received = '';
  const smtp = net.createServer(socket => {
    socket.setEncoding('utf8');
    socket.write('220 fixture ESMTP\r\n');
    let buffer = '';
    let data = false;
    socket.on('data', chunk => {
      buffer += chunk;
      while (buffer.includes('\r\n')) {
        const i = buffer.indexOf('\r\n');
        const line = buffer.slice(0, i);
        buffer = buffer.slice(i + 2);
        if (data && line !== '.') {
          received += line + '\r\n';
          continue;
        }
        if (data) {
          data = false;
          socket.write('250 queued\r\n');
        } else if (/^EHLO/.test(line)) socket.write('250 fixture\r\n');
        else if (line === 'DATA') {
          data = true;
          socket.write('354 send mail\r\n');
        } else if (line === 'QUIT') socket.end('221 bye\r\n');
        else socket.write('250 OK\r\n');
      }
    });
  });
  await listen(smtp);
  try {
    const { Email } = mailModel({
      type: 'smtp',
      host: '127.0.0.1',
      port: smtp.address().port,
      secure: false,
      ignoreTLS: true
    });
    await send(Email, message);
    assert.ok(received.includes('Security regression'));
    assert.ok(received.includes('<b>HTML content</b>'));
  } finally {
    await close(smtp);
  }
});

test('unused direct MX delivery fails closed', () => {
  const r = createRequire(require.resolve('loopback'));
  assert.throws(
    () => r('nodemailer-direct-transport')({}),
    /Direct mail delivery is disabled/
  );
});

test('legacy UUID entry points preserve LDAP identity bytes and use patched generation', () => {
  const r = createRequire(
    require.resolve('@freecodecamp/loopback-component-passport')
  );
  const format = require('../../tools/legacy-compat/bytes-to-uuid.cjs');
  assert.equal(
    format(Buffer.from('00112233445566778899aabbccddeeff', 'hex')),
    '00112233-4455-6677-8899-aabbccddeeff'
  );
  assert.equal(
    format(Buffer.from('ffff00112233445566778899aabbccddeeff', 'hex'), 2),
    '00112233-4455-6677-8899-aabbccddeeff'
  );
  assert.equal(
    format(Buffer.alloc(14)),
    '00000000-0000-0000-0000-00000000undefinedundefined'
  );
  const uuid = r('uuid');
  assert.equal(uuid.validate(uuid.v4()), true);
  assert.equal(uuid.version(uuid.v4()), 4);
  assert.equal(
    typeof r('@freecodecamp/loopback-component-passport').PassportConfigurator,
    'function'
  );
});

test('maintained request fork preserves HTTP form and redirect behavior', async () => {
  const r = createRequire(require.resolve('strong-remoting'));
  const request = r('request');
  const server = http.createServer((req, res) => {
    if (req.url === '/redirect') {
      res.writeHead(302, { location: '/result' });
      return res.end();
    }
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify({ path: req.url, body }));
    });
  });
  await listen(server);
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const call = options =>
      new Promise((resolve, reject) =>
        request(options, (err, res, body) =>
          err ? reject(err) : resolve({ res, body })
        )
      );
    assert.equal(
      (await call({ url: base + '/redirect', json: true })).body.path,
      '/result'
    );
    assert.equal(
      (
        await call({
          url: base,
          method: 'POST',
          form: { name: 'test user' },
          json: true
        })
      ).body.body,
      'name=test%20user'
    );
  } finally {
    await close(server);
  }
});

test('development explorer serves current Swagger UI and the local API schema', async () => {
  const previous = process.env.FREECODECAMP_NODE_ENV;
  process.env.FREECODECAMP_NODE_ENV = 'development';
  const app = loopback();
  app.set('restApiRoot', '/api');
  require('../src/server/boot/explorer')(app);
  const server = http.createServer(app);
  await listen(server);
  try {
    const base = `http://127.0.0.1:${server.address().port}/explorer`;
    const spec = await (await fetch(base + '/swagger.json')).json();
    assert.equal(spec.swagger, '2.0');
    assert.equal(spec.basePath, '/api');
    assert.match(
      await (await fetch(base + '/')).text(),
      /swagger-ui-bundle.js/
    );
    assert.match(
      await (await fetch(base + '/swagger-initializer.js')).text(),
      /\.\/swagger.json/
    );
  } finally {
    if (previous === undefined) delete process.env.FREECODECAMP_NODE_ENV;
    else process.env.FREECODECAMP_NODE_ENV = previous;
    await close(server);
  }
});

test('OAuth callback completes Passport session regeneration before cookies and redirect', async () => {
  process.env.JWT_SECRET = 'fixture-jwt-secret';
  const express = require('express');
  const passport = require('passport');
  const session = require('express-session');
  const jwt = require('jsonwebtoken');
  const { homeLocation } = require('../../config/env.json');
  const {
    createPassportCallbackAuthenticator
  } = require('../lib/server/component-passport');
  const passportLogin =
    require('../lib/server/middlewares/passport-login').default;
  const app = express();
  app.use(
    session({
      secret: 'fixture-session-secret',
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(passportLogin());
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, { id }));
  passport.use('security-fixture', {
    name: 'security-fixture',
    authenticate() {
      this.success(
        { id: 'fixture-user', acceptedPrivacyTerms: true },
        { accessToken: { id: 'fixture-access', ttl: 60000 } }
      );
    }
  });
  app.use((req, res, next) => {
    const messages = {};
    req.flash = (type, message) => {
      if (type) (messages[type] ||= []).push(message);
      return messages;
    };
    next();
  });
  app.use(require('../lib/server/middlewares/express-extensions').default());
  app.get('/before', (req, res) => {
    req.session.marker = 'before';
    res.json({ id: req.sessionID });
  });
  app.get(
    '/callback',
    createPassportCallbackAuthenticator('security-fixture', {
      provider: 'auth0'
    })
  );
  app.get('/whoami', (req, res) =>
    res.json({ user: req.user, id: req.sessionID })
  );
  app.get('/logout', (req, res, next) =>
    req.logout(err =>
      err ? next(err) : res.json({ authenticated: req.isAuthenticated() })
    )
  );
  const server = http.createServer(app);
  await listen(server);
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const before = await fetch(base + '/before');
    const beforeId = (await before.json()).id;
    const cookie = before.headers
      .getSetCookie()
      .find(x => x.startsWith('connect.sid='))
      .split(';')[0];
    const state = jwt.sign(
      {
        returnTo: homeLocation + '/learn',
        origin: homeLocation,
        pathPrefix: ''
      },
      process.env.JWT_SECRET
    );
    const response = await fetch(base + '/callback?state=' + state, {
      headers: { cookie },
      redirect: 'manual'
    });
    assert.equal(response.status, 302);
    const redirect = new URL(response.headers.get('location'));
    assert.equal(redirect.origin + redirect.pathname, homeLocation + '/learn');
    assert.match(
      decodeURIComponent(redirect.searchParams.get('messages')),
      /success\[0\]=flash.signin-success/
    );
    assert.ok(
      response.headers.getSetCookie().some(x => x.startsWith('tcjwt='))
    );
    const loggedCookie = response.headers
      .getSetCookie()
      .find(x => x.startsWith('connect.sid='))
      .split(';')[0];
    const identity = await (
      await fetch(base + '/whoami', { headers: { cookie: loggedCookie } })
    ).json();
    assert.equal(identity.user.id, 'fixture-user');
    assert.notEqual(identity.id, beforeId);
    const loggedOut = await (
      await fetch(base + '/logout', { headers: { cookie: loggedCookie } })
    ).json();
    assert.equal(loggedOut.authenticated, false);
  } finally {
    passport.unuse('security-fixture');
    await close(server);
  }
});
